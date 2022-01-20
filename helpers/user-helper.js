var db = require("../config/connection")


const collections = require("../config/collections");
const bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay")
var instance = new Razorpay({
    key_id: 'rzp_test_hGZsDFHqWfZWAy',
    key_secret: 'JWyvWfShDvASXHyuRzO0T5Z6',
  });
const { resolve } = require("promise");
const { response } = require("express");
const { ObjectID } = require("bson");
const { precompile } = require("handlebars");





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
                db.get().collection(collections.CART_COLLECTIONS).updateOne({user:ObjectId(userId),"items.item":ObjectId(proId)},
                
                {
                    $inc:{"items.$.quantity":1}
                }
                
                ).then(function(){
                    resolve()
                })
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
            },{
                $unwind:'$items'
            },{
                $project:{
                    item:'$items.item',
                    quantity:'$items.quantity'
                }
            },{
                $lookup:{
                    from:collections.ITEM_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'    
                }
            },{
                $project:{
                  item:1,quantity:1,products:{$arrayElemAt:['$product',0]}  
                }
            }
            
        ]).toArray()

        
        
        resolve(cartitems)
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
    },
    changeproductQuantity: function(details){
        console.log(details)
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        
        
        return new Promise(function(resolve,reject){
            if(details.count==-1 && details.quantity==1){
                db.get().collection(collections.CART_COLLECTIONS).updateOne({_id:ObjectId(details.cart)},
                {
                    $pull:{items:{item:ObjectId(details.product)}}
                }).then(function(response){
                    resolve({removeproduct:true})
                })
            }else{
            db.get().collection(collections.CART_COLLECTIONS)
            .updateOne({_id:ObjectId(details.cart),"items.item":ObjectId(details.product)},
                
            {
                $inc:{"items.$.quantity":details.count} 
            }
            
            ).then(function(response){
                resolve({status:true})
            })
        }
        })
    },gettotal:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            let total =await db.get().collection(collections.CART_COLLECTIONS).aggregate([
            { $match : {user:ObjectId(userId)}
            },{
                $unwind:'$items'
            },{
                $project:{
                    item:'$items.item',
                    quantity:'$items.quantity'
                    
                }
            },{
                $lookup:{
                    from:collections.ITEM_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'  
                }
            }, {
                $project:{
                  item:1,quantity:1,products:{$arrayElemAt:['$product',0]}  
                }
            },
            {
                $group:{
                    _id:null, 
                    total:{$sum:{$multiply:['$quantity','$products.price']}}
                }
            }]).toArray()
             console.log(total)
             resolve(total[0].total)
        })
        
    }, placeOrder : function(order,items,total){
        return new Promise(function(resolve,reject){
            console.log(order,items,total);
            let status = order["payment-method"] ==='COD'?'Placed':'Pending'
            let orderObj = {
                Deliverydetails:{
                    mobile: order.mobile,
                    Address:order.Address
                    


                },
                userId:ObjectId(order.userId),
                paymentMethod:order["payment-method"],
                total:total,
                items : items,
                status:status,
                date : new Date()
            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then(function(response){
                db.get().collection(collections.CART_COLLECTIONS).deleteOne({user:ObjectId(order.userId)})
                console.log("///---",response.insertedId)
                resolve(response.insertedId)
            })

        })

    },getcartproductlist: function(userId){
        return new Promise(async function(resolve,reject){
            let Cart = await db.get().collection(collections.CART_COLLECTIONS)
            .findOne({user:ObjectId(userId)})
            resolve(Cart.items)
        })
    },
    getorderDetails: function(userId){
        return new Promise(async function(resolve,reject){
            let orders = await db.get().collection(collections.ORDER_COLLECTION)
            .find({userId:ObjectID(userId)}).toArray()
            resolve(orders)
            console.log(orders)
        })
    },getproducts : (orderId)=>{
        return new Promise (async(resolve,reject)=>{
            let orderitem =await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                { $match : {_id:ObjectId(orderId)}
                },{
                    $unwind:'$items'
                },{
                    $project:{
                        item:'$items.item',
                        quantity:'$items.quantity'
                        
                    }
                },{
                    $lookup:{
                        from:collections.ITEM_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'  
                    }
                }, {
                    $project:{
                      item:1,quantity:1,products:{$arrayElemAt:['$product',0]}  
                    }}]).toArray()
                    
                    resolve(orderitem)
                    console.log(orderitem)
            
        })
    },
    generateRazorpay : function(orderId,total){
        console.log("orderID1:",orderId)
        return new Promise (function(resolve,reject){
            var options = {
                amount : total*100,
                currency : "INR",
                receipt : ""+orderId
            };
            instance.orders.create(options,function(err,order){
                if(err){
                    console.log(err)
                }else{
                console.log("New order:",order);
                typeof
                resolve(order)
                }
            })

        })
    },
    verifyPayment : function(details){
        return new Promise (function(resolve,reject){
            var crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'JWyvWfShDvASXHyuRzO0T5Z6');
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if(hmac==details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },changePaymentstaus : function(orderId){
        return new Promise(function(resolve,reject){
            db.get().collection(collections.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId)},
                
               {
                   $set:{
                       status:"placed"
                   }
               }
            
            ).then(function(){
                resolve()
            })
        })
    }



}