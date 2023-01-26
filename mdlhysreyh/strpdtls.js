var mongoose = require('mongoose')
Schema = mongoose.Schema;

const stripeList = mongoose.Schema({
"userId"              : {type:Schema.Types.ObjectId},
"amount"              : { type: Number }, 
"currency"            : { type: String },   
"source"              : { type: String }, 
"description"         : { type: String },
"shipping"            : { type: Object },
"id"                  : { type: String },
"balance_transaction" : { type: String },
"status"              : { type: String },
"created"             : { type: Number },
"payment_method"      : {type : String},
"network"             : { type: String },
"receipt_url"         : { type: String },
"Received_value"      : { type: String },
"buyAmount"           : {type: Number},
"buyCurrency"         : {type : String},
"approvehash"         : {type : String},
"created_at"        : { type : Date, default : Date.now},

})
stripeList.index({status:1})
module.exports =  mongoose.model("CT_strpdtls", stripeList,'CT_strpdtls' )

