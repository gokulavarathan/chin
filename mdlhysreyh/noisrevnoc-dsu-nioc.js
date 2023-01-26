var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var currenciesSchema = new Schema({
	cur_type:{
		type: String,
        enum:["fiat","crypto","token","stable"]
	},
	currencies : [{
		currency: { 
			type: String,
			default:'' 
		}, 
		amount: {
			type: Number, 
			default: 1
		},
		usd_price: {
			type: Number, 
			default: 0
		},
		symbol: { 
			type: String,
			default:'' 
		}, 
	}],
	status:{type:Boolean,default:true}
});
currenciesSchema.index({currency:1})

module.exports = mongoose.model('NioCuSdeuLav', currenciesSchema,"CT_niocusdeulavs")