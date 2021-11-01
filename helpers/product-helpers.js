var db = require("../config/connection")

 

module.exports = {
    addproduct : function(items,callback){
        console.log(items);
        db.get().collection("items").insertOne(items).then(function(data){
            
            console.log(data)
            callback(data.insertedId)

            
            
              
        })

    }
}