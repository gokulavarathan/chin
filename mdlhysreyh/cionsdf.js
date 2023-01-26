const mongoose = require('mongoose');

let currencySchema = new mongoose.Schema({
  "name"			: { type: String, index: true },
  "symbol" 			: { type: String, index: true },
  "code" 			: { type: String, index: true },

  "created_at"		: { type: Date, default: Date.now },
  "fee":{type: Number},
  "hash"        :{ type: String},
  "address"     :{type: String},
  "age"         :{type: String}
},{"versionKey" : false});
currencySchema.index({name:1})

module.exports = mongoose.model('cionxd', currencySchema,'CT_cionxd');