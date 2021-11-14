var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
const userhelper = require('../helpers/user-helper');

/* GET home page. */
router.get('/', function(req, res, next) { 
  let user = req.session.user
  console.log(user);

  productHelpers.getAllProducts().then(function(flowers){
    
    res.render("../user/all-products",{flowers,User:true,user})
  })
  
  
});
router.get("/login",function(req,res,next){
    
  res.render("../user/login",{User:true})
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
      res.redirect("/login")
    }
  })
})
router.get("/logout",function(req,res){
  req.session.destroy()
  res.redirect("/login")
})


module.exports = router;
