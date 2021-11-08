var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers")

/* GET home page. */
router.get('/', function(req, res, next) { 
  productHelpers.getAllProducts().then(function(flowers){
    console.log(flowers)
    res.render("../user/all-products",{flowers,User:true})
  })
  
  
});
router.get("/login",function(req,res,next){
    
  res.render("../user/login",{User:true})
});
router.get("/signup",function(req,res,next){

  res.render("../user/signup",)
})


module.exports = router;
