const mongoose = require("mongoose");
Schema = mongoose.Schema

const proposalVoteSchema = new mongoose.Schema({
    "proposalId": { type: Schema.Types.ObjectId },
    "history": [{
        "userId": { type: Schema.Types.ObjectId },
        "vote": { type: String, enum: ["positive", "negative"] },
        "voteStatus": { type: Boolean, default: true },
        "CreatedAt": { type: Date, default: Date.now }
    }]
});
proposalVoteSchema.index({userId:1})

module.exports = mongoose.model("salsoporpetov", proposalVoteSchema,"CT_salsoporpetov");
