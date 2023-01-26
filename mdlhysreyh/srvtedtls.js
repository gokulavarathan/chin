const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let voteSchema = new Schema({
  "user_id"  : {type: mongoose.Schema.Types.ObjectId, ref: 'CT_usvhyhj'},
  "hash": { type: String, default: ''},
  "sraddress" : { type: String, default: ''},
  "useraddress" : { type: String, default: ''},
  "amount" : { type: Number,default:0},
  "note": { type: String, default: ''},
  "status" : { type: String, default: ''},
  "created_at"   : { type: Date, default: Date.now },
  "updated_at"   : { type: Date, default: Date.now },
 }, {"versionKey": false});

module.exports = mongoose.model('CT_srvtdtls', voteSchema,'CT_srvtdtls');