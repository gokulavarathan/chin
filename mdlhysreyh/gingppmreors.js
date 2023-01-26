const mongoose = require('mongoose');
const OrdermappingSchema = new mongoose.Schema({
    "buyUserId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usvhyhjs'
    },
    "sellUserId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usvhyhjs'
    },
    "orderId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderp2p'
    },
    "amount": {
        type: Number
    },
    "price": {
        type: Number
    },
    "total": {
        type: Number
    },
    "orderType": {
        type: String
    },
    "sellerConfirmation": {
        type: Boolean,
        default: false
    },
    "buyerConfirmation": {
        type: Boolean,
        default: false
    },
    "buyerDatetime": {
        type: Date
    },
    "sellerDatetime": {
        type: Date
    },
    "chats": {
        type: Array
    },
    "disputeChats": {
        type: Array
    },
    "dispute": {
        type: Boolean,
        default: false
    },
    "timerStatus": {
        type: Boolean,
        default: false
    },
    "disputeRaiser": {
        type: String,
        default: ""
    },
    "proof": {
        type: String,
        default: ""
    },
    "reason": {
        type: String,
        default: ""
    },
    "favour": {
        type: String,
        default: ""
    },
    "disputeDatetime": {
        type: Date
    },
    "comments": {
        type: String,
        default: ""
    }, "disputeComments": {
        type: String,
        default: ""
    },
    "datetime": {
        type: Date,
        default: Date.now
    },
    "fromCurrency": {
        type: String,
        default: ""
    },
    "toCurrency": {
        type: String,
        default: ""
    },
    "time": {
        type: Number,
        default: Date.now()
    },
})
OrdermappingSchema.index({ proof: 1 })

module.exports = mongoose.model('PPredroMapINg', OrdermappingSchema, 'CT_PPredroMapINg');