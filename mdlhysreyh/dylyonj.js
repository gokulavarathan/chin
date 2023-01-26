var mongoose = require('mongoose')

const depositSchema = mongoose.Schema({
    "user_id": { type: mongoose.Schema.Types.ObjectId, ref: 'users' },

    "amount": { type: String },
    "transhash": { type: String },
    "approvehash": { type: String },
    "paymentAmount": { type: String },
    "buyCurrency": { type: String },
    "paymentCurrency": { type: String },
    "walletAddress": { type: String },
    "status": { type: Number, default: 0 },
    "depositType": { type: Number }, // 1-Fiat, 2-Crypto
    "paymentType": { type: Number, default: 0 },  // 1-Bank Payment, 2-Card Payment
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: Date.now },
    "protect_key": { type: String },
    "user_name": { type: String }
})
depositSchema.index({ user_id: 1, buyCurrency: 1 });

module.exports = mongoose.model("dylyonj", depositSchema, "CT_dylyonjdgvdfg")

