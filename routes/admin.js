var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers")

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then(function(flowers){
    console.log(flowers)
    res.render("admin/all-products",{flowers,admin:true})
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

module.exports = router;
