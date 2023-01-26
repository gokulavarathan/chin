var mongoose = require('mongoose')

const adminBankSchema = mongoose.Schema({
    "orderId": { type: String },
    "RoomId": { type: String },
    "Chats": { type: Array },
    "users": { type: Array },

    "status": { type: Boolean, default: true },
    "created_at": { type: Date, default: Date.now },
})
adminBankSchema.index({ orderId: 1 })
module.exports = mongoose.model('CT_chtrroom', adminBankSchema, 'CT_chtrroom')
