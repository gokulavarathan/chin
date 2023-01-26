const mongoose = require("mongoose");

const stacking = new mongoose.Schema({
    "userId":{ type:mongoose.Schema.Types.ObjectId },
    "hexAddress":{ type:String },
    "duration":{ type: Number },
    "hash":{ type:String },
    "amount":{ type:Number },
    "type":{ type:String },
    "status":{ type:Number, default: 0 },
    "createdDate":{ type:Date, default: Date.now() },
    "unstakeTime":{type: Date, default:Date.now()}
    
})
stacking.index({userId:1})

module.exports = mongoose.model("staernmds",stacking,"CT_staernmds")