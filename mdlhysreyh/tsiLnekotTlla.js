      var mongoose = require('mongoose')
	  Schema = mongoose.Schema;

const allTokensList = mongoose.Schema({
    "userId"            : {type:Schema.Types.ObjectId},
    "name"              : { type: String }, 
    "symbol"            : { type: String },   
    "totalSupply"       : { type: String }, 
    "decimals"          : { type: String },
    "hash"              : { type: String },
    "depolyedtime"      : { type: String },
    "address"           : { type: String },
    "deployederAddress" : { type: String },
    "status"            : {type : Number, default:0},
    "hexAddress"        : { type: String },
    "address"           : { type: String },
    "deployType"        : { type: String },
    "dated"             : {type: Date, default: Date.now},

})
allTokensList.index({hexAddress:1})
module.exports =  mongoose.model("CT_alltknslsts", allTokensList,'CT_alltknslsts' )

