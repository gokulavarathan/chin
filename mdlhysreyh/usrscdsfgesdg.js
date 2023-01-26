var mongoose = require('mongoose')

const regSchema = new mongoose.Schema({
    "protect_key"   : { type: String }, 
    "unusual_key"   : { type: String }, 
    "security_key"  : { type: String }, 
    "user_name"     : { type: String }, 
    "dob"  	        : { type: Date }, 
    "mobile_no"  	: { type: Number }, 
    "zip_code"  	: { type: Number }, 
    "ac_status"     : { type: Number, default:0 }, // 0-Not yet activated, 1-activated, 2-suspended
    "tfa_status"    : { type: Number, default:0 }, // 0-Not yet uploaded, 1-approved, 2-pending
    "kyc_status"    : { type: Number, default:0 }, 
    "ip_address"    : { type: String }, 
    "address"       : { type: String }, 
    "hexAddress"    : { type: String }, 
    "aceRandom"     : { type: String }, 
    "endRandom"     : { type: String }, 
    "country"     : { type: String }, 
    "tfa_status"    : { type:Boolean , default: false},
    "E_wallet"    : { type:Boolean , default: false},
    "Token_Deploy"    : { type:Boolean , default: false},
    "secret_key"    : {type:Object },
    "token"         :{type:String },
    "proposalStatus"   :{type: Boolean, default: false},
    "staking_status": { type: Boolean, default: false},
    "witness_status": {type: Boolean, default: false},
    "secretotpauthurl":{type:String  },
    "created_at"    : { type : Date , default : Date.now},
    "updated_at"    : { type : Date , default : Date.now},
    "captcha"       : {type:String  },
    "profileStatus"       : {type:Boolean , default:false },
    "SRstatus"       : {type:Boolean , default:false }
    
})
regSchema.index({protect_key:1})

module.exports =  mongoose.model("usvhyhj", regSchema ,'CT_usvhyhj')

