const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let addressSchema = new Schema({
  "user_id"  : {type: mongoose.Schema.Types.ObjectId, ref: 'usvhyhjs'},
  "address" : { type: String, default: ''},
  "ethaddress" : { type: String, default: ''},
  "swapTime"   : { type: Date, default: Date.now },
  "dest" : { type: String, default: ''},
  "tag": { type: String, default: ''},
  "qrimage"	: { type: String, default: ''},
  "currency" : { type: String, default: ''},
  "network" : { type: String, default: 'livenet'},
  "wallet"    : [{
          "token": { type: String, uppercase: true }, 
          "address"  : { type: String, default: '' },
          "balance"  : { type: Number, default: 0 },
          "supply"  : { type: Number, default: 0 },
          "decimal"  : { type: Number, default: 0 },
          "lastUpdate"    : { type: Date, default: Date.now }
        }],
  "status" : { type: Number, default: 1},
  "created_at"   : { type: Date, default: Date.now },
  "updated_at"   : { type: Date, default: Date.now },
 }, {"versionKey": false});
 addressSchema.index({user_id:1})

module.exports = mongoose.model('trUsrAddrs', addressSchema);
