var db = require("../config/connection")


const collections = require("../config/collections");
const bcrypt = require("bcrypt")

module.exports = {

    dosignup : function(userdata){

        return new Promise (async function(resolve,reject){
            userdata.password= await bcrypt.hash(userdata.password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userdata).then(function(data){
                resolve(data.insertedId)
            })
        })
        
    }

}