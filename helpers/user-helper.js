var db = require("../config/connection")


const collections = require("../config/collections");
const bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;
const { resolve } = require("promise");
const { CART_COLLECTIONS } = require("../config/collections");



module.exports = {

    dosignup : function(userdata){

        return new Promise (async function(resolve,reject){
            userdata.password= await bcrypt.hash(userdata.password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userdata).then(function(data){
                resolve(data.insertedId)
            })
        })
        
    },
    dologin : function(userdata){
        return new Promise (async function(resolve,reject){
            let loginstatus = false
            let response = {}
            
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({email:userdata.Email})
            if(user){
                bcrypt.compare(userdata.password,user.password).then(function(status){
                    if(status){
                        console.log("login success")
                        
                        response.status = true
                        response.user = user
                        resolve(response)
                    }else{
                        console.log("Login failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Account Does'nt exists")
                resolve({status:false})
            }
        })
    },addTocart : function(proId,userId){

        let proObj = {
            item : ObjectId(proId),
            quantity : 1
        }
        
        return new Promise(async function(resolve,reject){

        let usercart = await db.get().collection(collections.CART_COLLECTIONS).findOne({user:ObjectId(userId)})

        if (usercart){
            
            let proExist = usercart.items.findIndex(product=>product.item==proId)
            console.log(proExist)
            if(proExist != -1){
                db.get().collection(collections.CART_COLLECTIONS).updateOne({"items.item":ObjectId(proId)},
                
                {
                    $inc:{"items.$.quantity":1}
                }
                
                )
            }else{
            db.get().collection(collections.CART_COLLECTIONS).updateOne({user:ObjectId(userId)},
            
            {
                $push :{items:proObj} 
                
            }
            
           ).then(function(){
                resolve()
            })}

        }else{
            let cartobj = {
                user : ObjectId(userId),
                items : [proObj]
            }
            db.get().collection(collections.CART_COLLECTIONS).insertOne(cartobj).then(function(response){
                
                resolve()
            })       
         }

        })
    },
    getCartitems : (userId)=>{
        return new Promise(async (resolve,reject)=>{
            let cartitems =await db.get().collection(collections.CART_COLLECTIONS).aggregate([
            {
                $match : {user:ObjectId(userId)}
            }
            
        ]).toArray()

        
        console.log(cartitems)
        resolve(cartitems[0].cartitems)
        })

    },getCartCount : function(userId){
        return new Promise(async function(resolve,reject){
            let count = 0
            let cart = await db.get().collection(collections.CART_COLLECTIONS).findOne({user:ObjectId(userId)})
            if(cart){
                count = cart.items.length
            }
            resolve(count)
        })
    }

}