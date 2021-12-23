var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
var userHelper = require('../helpers/user-helper');

const verifylogin = function(req,res,next){
  if(req.session.loggedIn){
    next()
  }
  
  else{
    res.redirect("/login")
  }
} 

/* GET home page. */
router.get('/', async function(req, res, next) { 
  let user = req.session.user
 let CartCount = null
 if(req.session.user){
 CartCount = await userHelper.getCartCount(req.session.user._id)
 }
  

  productHelpers.getAllProducts().then(function(flowers){
    
    res.render("../user/all-products",{flowers,User:true,user,CartCount})
  })

});
router.get("/login",function(req,res,next){
  if(req.session.loggedIn){
    res.redirect("/")
  }else {
  res.render("../user/login",{User:true,"loginErr":req.session.loginErr})
  req.session.loginErr = false
}
});
router.get("/signup",function(req,res,next){

  res.render("../user/signup",{User:true})
})
router.post("/signup",function(req,res){

  userHelper.dosignup(req.body).then(function(response,err){

    if(!err){
      console.log(req.body)
    }else{
      console.log(err)
    }

  })
  res.redirect("/login")

})
router.post("/login",function(req,res){
  userHelper.dologin(req.body).then(function(response){
    if(response.status){
      
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect("/")
    }else{
      req.session.loginErr = true
      res.redirect("/login")
    }
  })
})
router.get("/logout",function(req,res){
  req.session.destroy() 
  res.redirect("/login")
})
router.get("/cart",verifylogin,async (req,res)=>{
  
  let items  = await userHelper.getCartitems(req.session.user._id)
  
  console.log(items)

  res.render("../user/cart",{items,User:true,user:req.session.user})
})
router.get("/add-to-cart/:id",function(req,res){

  console.log("api call")

  userHelper.addTocart(req.params.id,req.session.user._id).then(function(){
    
  res.json({status:true})
    
    
  })

})
router.post("/change-product-quantity",function(req,res,next){
  console.log(req.body)
  userHelper.changeproductQuantity(req.body).then(function(response){

    res.json(response)  

  })
})
router.get("/place-order",async(req,res)=>{
  let total = await userHelper.gettotal(req.session.user._id)
  res.render("../user/place-order",{User:true,user:req.session.user})
})
module.exports = router;

