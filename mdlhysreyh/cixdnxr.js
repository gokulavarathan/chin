const mongoose = require('mongoose');

let currencySchema = new mongoose.Schema({
  "name"			: { type: String, index: true },
  "symbol" 			: { type: String, index: true },
  "code" 			: { type: String, index: true },
  "wallet_address"  : { type: String },
  "status"  : { type: Number, default:0 },
  "fee":{type:Number, default:0}, // withdraw fee
	"min_withdraw":{type:Number, default:0.5}, // min withdraw individual user
	"max_withdraw":{type:Number, default:1}, // max withdraw individual user
  "created_at"		: { type: Date, default: Date.now },
  "euroValue": { type: Number},
  "usdValue": { type: Number},
},{"versionKey" : false});
currencySchema.index({name:1})

module.exports = mongoose.model('cixdnxr', currencySchema,'CT_cixdnxr');