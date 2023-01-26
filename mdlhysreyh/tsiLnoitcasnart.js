const mongoose = require('mongoose');

let transactionListSchema = new mongoose.Schema({


 
 "user_id"           : { type: mongoose.Schema.Types.ObjectId, ref: 'usvhyhj'},
    "amount"            : { type: Number, default:0 },
    "transhash"         : { type: String },
    "approvehash"       : { type: String }, 
    "buyCurrency"       : { type: String }, 
     "sendCurrency"       : { type: String },
     "from"       : { type: String }, 
     "to"       : { type: String },
    "paymentCurrency"   : { type: String }, 
    "walletAddress"     : { type: String },
    "status"            : { type: Number, default: 0 },
    "depositType"       : { type: Number, default: 1 }, // 1-Fiat, 2-Crypto
    "paymentType"       : { type: Number, default: 0 },  // 1-Bank Payment, 2-Card Payment
    "created_at"        : { type : Date, default : Date.now},
    "updated_at"        : { type : Date, default : Date.now},
    "dob"               : {type : Date},
    "depositStatus"     : { type: String }, //0-Pending,1-Completed,2-Rejected
    "user_name"  	: { type: String },
    "sellCurrency"      : { type: String }, 
    "currency"      : { type: String }, 
    "receivingCurrency" : { type: String }, 
    "withdrawType"      : { type: Number, default: 1 }, // 1-Fiat, 2-Crypto
    "sellCurrency"      : { type: String }, 
    "reason"           	: { type: String },
    "blockNumber"       : { type: Number }, 
    "contract_address"  : { type: Array }, 
    "result"            : { type: String }, 
    "time"              : { type: Number }, 
    "fee"               : { type: Number }, 
    "owner_address"     : { type: String }, 
    "Transfer_type"     : { type: String }, 
    "type"     : { type: String }, 
    "to_address"        : { type: String }, 


    "tokenName":{ type: String },
    "tokenSymbol":{ type: String },
    "tokenDecimals":{ type: String },
    
},{"versionKey" : false});
transactionListSchema.index({user_id:1})

module.exports = mongoose.model('trsctnlsts', transactionListSchema,'CT_trsctnlsts');




