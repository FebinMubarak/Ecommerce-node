var db = require("../config/connection")


const collections = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");

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
    }

}