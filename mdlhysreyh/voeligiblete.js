const mongoose = require("mongoose");
Schema = mongoose.Schema

const voteEligibility = new mongoose.Schema({
    "userId": { type: Schema.Types.ObjectId },
    "total_power":{type: Number},
    "total_vote":{type: Number, default:0},
    "createdDate":{type: Date, default:Date.now()},
    "modifiedDate":{type: Date, default: Date.now()}
    
});
voteEligibility.index({userId:1})

module.exports = mongoose.model("voeligiblete", voteEligibility,"CT_voeligiblete");
