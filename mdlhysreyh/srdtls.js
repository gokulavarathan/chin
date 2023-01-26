const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let srSchema = new Schema({
  "sr_id" : { type: Number},
  "last_rank" : { type: Number},
  "address" : { type: String},
  "hexAddress" : { type: String},
  "voteCount" : { type: Number},
  "allowance" : { type: Number,default: 0},
  "brokerage" : { type: Number,default: 0},
  "votePending" : { type: Number,default: 0},
  "url" : { type: String},
  "banner" : { type: String},
  "totalProduced" : { type: Number},
  "latestSlotNum" : { type: String},
  "latestBlockNum" : { type: String},
  "isJobs" : { type: String, default: ''},
  "github" : { type: String, default: ''},
  "devTeam" : { type: String, default: ''},
  "repo" : { type: String, default: ''},
  "branch" : { type: String, default: ''},
  "status" : { type: String, default: 1},
  "nextRound" : { type: Date},
  "created_at"   : { type: Date, default: Date.now },
  "updated_at"   : { type: Date, default: Date.now },
 }, {"versionKey": false});

module.exports = mongoose.model('CT_SfhwtyjlutgR', srSchema,'CT_SfhwtyjlutgR');