var mongoose = require('mongoose')

const withdrawSchema = mongoose.Schema({
    "user_id"           : { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    "amount"            : { type: String },
    "receivingAmount"   : { type: String }, 
    "sellCurrency"      : { type: String }, 
    "receivingCurrency" : { type: String }, 
    "walletAddress"     : { type: String },
    "status"            : { type: Number},
    "withdrawType"      : { type: Number }, // 1-Fiat, 2-Crypto
    "paymentType"       : { type: String, default: "" },  // 1-Bank Payment, 2-Card Payment 3-Bankwire
    "created_at"        : { type : Date, default : Date.now},
    "updated_at"        : { type : Date, default : Date.now},
    "protect_key"       : { type: String}, 
    "user_name"  	    : { type: String }
})
withdrawSchema.index({user_id:1})

module.exports =  mongoose.model("wdidrth", withdrawSchema,"CT_wdidrths" )

