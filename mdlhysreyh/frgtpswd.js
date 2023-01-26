var mongoose = require('mongoose')

const forgotSchema = mongoose.Schema({
    "userId":{ type:mongoose.Schema.Types.ObjectId },
    "token"  : { type: String }, 
    "keyGenetd"  : { type: String }, 
    "type": { type: String },
    "status"    : { type: Number},
    "created_at": { type : Date, default : Date.now},
})
forgotSchema.index({acName:1})
module.exports = mongoose.model('CT_frgtpswd', forgotSchema,'CT_frgtpswd')

