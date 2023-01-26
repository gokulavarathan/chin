const mongoose = require("mongoose");
Schema = mongoose.Schema

const proposal = new mongoose.Schema({
    "title": { type: String },
    "content": { type: String },
    "positive": {
        type: Number,
        default: 0
    },
    "negative": {
        type: Number,
        default: 0
    },
    "total": {
        type: Number,
        default: 0
    },
    "approvehash":{
        type: String
    },
    "hexAddress":{
        type: String
    },
    "status": { type: String, enum:[ "active","inactive" ], default: "inactive" },
    "createdAt": { type: Date, default: Date.now }
});
proposal.index({title:1})

module.exports = mongoose.model("pposal", proposal,"CT_pposal");

