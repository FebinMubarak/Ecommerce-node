var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
const userhelper = require('../helpers/user-helper');
const verifylogin = function(req,res,next){
  if(req.session.loggedIn){
    next()
  }
  
  else{
    res.redirect("/login")
  }
}

/* GET home page. */
router.get('/', function(req, res, next) { 
  let user = req.session.user
  

  productHelpers.getAllProducts().then(function(flowers){
    
    res.render("../user/all-products",{flowers,User:true,user})
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

  userhelper.dosignup(req.body).then(function(response,err){

    if(!err){
      console.log(req.body)
    }else{
      console.log(err)
    }

  })
  res.redirect("/login")

})
router.post("/login",function(req,res){
  userhelper.dologin(req.body).then(function(response){
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
router.get("/cart",verifylogin, function(req,res){
  
  
  res.render("../user/cart",{User:true,user:req.session.user})
})

module.exports = router;
