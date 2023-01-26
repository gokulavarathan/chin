var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transferSchema = new Schema({
	user_id:{
		type:Schema.Types.ObjectId
		
	},
	to_address:{
		type: String
	},
    amount:{
		type: Number
	},
    token:{
		type: String
    },
	approvehash      : { type: String }, 

	status:{type:Boolean,
	default:true},
    date: { type : Date, default : Date.now},


});
transferSchema.index({user_id:1})

module.exports = mongoose.model('trnsfrlst', transferSchema,"CT_trnsfrlsts")