var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers")

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then(function(flowers){
    console.log(flowers)
    res.render("admin/all-products",{flowers,User:false})
  })
  
});
router.get("/add-product",function(req,res){
  res.render("admin/add-product")
})
router.post("/add-product",function(req,res){
  console.log(req.body)
  console.log(req.files.Image)
  productHelpers.addproduct(req.body,function(insertedId){
    let image = req.files.Image
    console.log(insertedId)
    image.mv("./public/images/"+insertedId+".jpg",function(err){
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err)
      }
    
    })
    res.render("admin/add-product")
  })
})
router.get("/delete-product/:id",function(req,res){
  let proId = req.params.id
  console.log(proId)
  productHelpers.deleteproducts(proId).then(function(response){
    res.redirect("/admin")
  })
})

router.get("/edit-product/:id",async function(req,res){
  let product = await productHelpers.getproductDetails(req.params.id)
  console.log(product)
  res.render("admin/edit-product",{product})
})
router.post("/edit-product/:id",function(req,res){
  productHelpers.updateproduct(req.params.id,req.body).then(function(){
    res.redirect("/admin")
    let insertedId = req.params.id
    let image = req.files.Image
    image.mv("./public/images/"+insertedId+".jpg")
    

  })
})

module.exports = router;
