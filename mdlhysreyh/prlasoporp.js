const mongoose = require("mongoose");
Schema = mongoose.Schema

const proposalSchema = new mongoose.Schema({
    "title": { type: String },
    "content": { type: String },
    "image": { type: String, default:'' },
    "votes": {
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
		}
	},
	"hexAddress":{
		type: String,
		default:""
	},
	"approvehash":{
		type: String,
	
	},
    "status": { type: String, enum:[ "active","inactive" ], default: "inactive" },
    "createdAt": { type: Date, default: Date.now }
	
});
proposalSchema.index({title:1})

module.exports = mongoose.model("slasoporp", proposalSchema,"CT_slasoporp");