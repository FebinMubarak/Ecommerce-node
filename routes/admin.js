var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers")

/* GET users listing. */
router.get('/', function(req, res, next) {
  let flowers = [
    {
      Name: "Orchid",
      Catogory: "Flowers",
      Description :"White Hydrangea, 5 Blue Orchid, 5 Rose, Wax FIlling with seasonal greenery ",
      image:"https://www.juneflowers.ae/pub/media/catalog/product/cache/cf3f2243ef4940fd5c66f2ff035145ac/j/f/jf_fl_1138_dazzling_hydrangea_with_orchid_in_fish_bowl.jpg"
    },
    {
      Name:"Orchid Purple",
      Catogory:"Flowers",
      Description:" A simple yet sophisticated way to convey love and admiration or affection and gratitude.",
      image:"https://www.juneflowers.ae/pub/media/catalog/product/cache/cf3f2243ef4940fd5c66f2ff035145ac/1/0/108---phalaenopsis-purple-single-stem.jpg"
    },
    {
      Name:"Lavish Pink Flowers",
      Catogory:"flowers",
      Description:"Combination of Pink Roses,Pink Spray Roses and Pink Lisianthus with Seasonal Greenery.",
      image:"https://www.juneflowers.ae/pub/media/catalog/product/cache/cf3f2243ef4940fd5c66f2ff035145ac/j/f/jf_fl_1145_fantasy_of_lavish_pink_rose_arrangement.jpg"
    },
    {
      Name:"Red Rose",
      Catogory:"flowers",
      Description:"A sensational bouquet of 20 stems red roses in a black wrap.,Passionate in substance",
      image:"https://www.juneflowers.ae/pub/media/catalog/product/cache/cf3f2243ef4940fd5c66f2ff035145ac/r/e/red_rose_in_black_wrap.png"
    }
  ]
  res.render("admin/all-products",{flowers,admin:true})
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
    image.mv("./public/images/items-images"+insertedId+".jpg",function(err){
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
