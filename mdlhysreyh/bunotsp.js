const mongoose = require('mongoose');

let currencySchema = new mongoose.Schema({
  "name"		  	: { type: String, index: true },
  "symbol" 			: { type: String, index: true },
  "code" 		  	: { type: String, index: true },
  "status"      : { type: Number, default:0 },
  "created_at"	: { type: Date, default: Date.now },
  "fee"         :{type: Number},
  "convert"         :{type: Number},
  "hash"        :{ type: String},
  "address"     :{type: String},
  "age"         :{type: String},
  "type":{type: String},
  "totalSupply":{type: Number},
  "burnedCoins":{type: Number},

},{"versionKey" : false});
currencySchema.index({name:1})

module.exports = mongoose.model('CT_bunotsp', currencySchema,'CT_bunotsp');