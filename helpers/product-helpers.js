var db = require("../config/connection")

const collections = require("../config/collections");

 

module.exports = {
    addproduct : function(items,callback){
        console.log(items);
        db.get().collection("items").insertOne(items).then(function(data){
            
            console.log(data)
            callback(data.insertedId)

            
            
              
        })

    },getAllProducts : function(){
        return new Promise(async function(resolve,reject){
            let flowers = await db.get().collection(collections.ITEM_COLLECTION).find().toArray()
            resolve(flowers)
        })
    }
}