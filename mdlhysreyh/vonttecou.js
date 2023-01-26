const mongoose = require("mongoose");
Schema = mongoose.Schema

const voteSchema = new mongoose.Schema({
    "proposalId": { type: Schema.Types.ObjectId },
    "userId": { type: Schema.Types.ObjectId },
    "vote": { type: String, enum: ["positive", "negative"] },
    "positive": { type: Number, default: 0 },
    "negative": { type: Number, default: 0 },
    "voteStatus": { type: Boolean, default: true },
    "CreatedAt": { type: Date, default: Date.now }
  
});
voteSchema.index({userId:1})

module.exports = mongoose.model("salsoptov", voteSchema,"CT_salsoptov");


