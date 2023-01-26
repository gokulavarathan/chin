var mongoose = require('mongoose')

const adminBankSchema = mongoose.Schema({
    "name"    : { type: String }, 
    "symbol"  : { type: String }, 
    "totalSupply"  : { type: String }, 
    "decimals": { type: String },
    "hash" : { type: String },
    "depolyedtime"    : { type: String },
    "token address": { type: String },
    "deployederAddress": { type: String },
})
adminBankSchema.index({name:1})

module.exports =  mongoose.model("adxnygj", adminBankSchema ,"CT_adxnygj")
