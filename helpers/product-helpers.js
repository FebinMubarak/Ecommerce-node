var db = require("../config/connection")

const collections = require("../config/collections");
var ObjectId = require("mongodb").ObjectId


 

module.exports = {
    addproduct : function(items,callback){
        console.log(items);
        items.price = parseInt(items.price)
        db.get().collection("items").insertOne(items).then(function(data){
            
            console.log(data)
            callback(data.insertedId)

            
            
              
        })

    },getAllProducts : function(){
        return new Promise(async function(resolve,reject){
            let flowers = await db.get().collection(collections.ITEM_COLLECTION).find().toArray()
            resolve(flowers)
        })
    },deleteproducts : function(proId){

        return new Promise(function(resolve,reject){
            

            db.get().collection(collections.ITEM_COLLECTION).deleteOne({_id:ObjectId(proId)}).then(function(response){
                
                console.log(response)
                resolve(response)
            })

        })

    },getproductDetails : function(proId){

        return new Promise(function(resolve,reject){
            db.get().collection(collections.ITEM_COLLECTION).findOne({_id:ObjectId(proId)}).then(function(product){
                resolve(product)
            })
        })

    },updateproduct : function(proId,proDetails){
        return new Promise(function(resolve,reject){
            
            db.get().collection(collections.ITEM_COLLECTION).updateOne({_id:ObjectId(proId)},
            {
                $set : {
                    name : proDetails.name,
                    price : parseInt(proDetails.price),
                    catogory : proDetails.catogory,
                    Description : proDetails.Description

                }

            }).then(function(response){

                resolve()

            })
        })
    }

}