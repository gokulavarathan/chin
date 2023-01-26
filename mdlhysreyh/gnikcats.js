const mongoose = require("mongoose");

const stackingSchema = new mongoose.Schema({
    "userId":{
        type:mongoose.Schema.Types.ObjectId
    },
    "walletAddress":{
        type:String,
        
    },
    "hash":{
        type:String,
        
    },
    "amount":{
        type:String,
    },
    "resource":{
        type:String,
    },
    "time":{
        type:String,

    },
    "type":{
        type:String,
    },
    
})
stackingSchema.index({userId:1})

module.exports = mongoose.model("SSingemcha",stackingSchema,"CT_SSingemcha")