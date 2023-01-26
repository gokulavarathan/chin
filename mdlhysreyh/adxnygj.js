var mongoose = require('mongoose')

const adminBankSchema = mongoose.Schema({
    "acName"    : { type: String }, 
    "acNumber"  : { type: String }, 
    "bankName"  : { type: String }, 
    "bankBranch": { type: String },
    "swiftCode" : { type: String },
    "status"    : { type: Number, default: 0 },
    "created_at": { type : Date, default : Date.now},
})
adminBankSchema.index({acName:1})
module.exports = mongoose.model('CT_adbkseds', adminBankSchema,'CT_adbkseds')


