const mongoose = require('mongoose');
const orderp2pSchema = new mongoose.Schema({
    "userId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usvhyhj'
    },
    "orderType": {
        type: String
    },
    "fromCurrency": {
        type: String
    },
    "toCurrency": {
        type: String
    },
    "price": {
        type: Number
    },
    "amount": {
        type: Number
    },
    "total": {
        type: Number
    },
    "placerOwnAddress": {
        type: String
    },
    "userWalletAddress":{
        type: String
    },   
    "approvehash":{
        type: String
    },
    "isKycNeed": {
        type: Boolean,
        default: false
    },
    "status": {
        type: Number,
        default: 0 //0 - pending, 1-completed, 2-pending, 3- cancelled, 4- dispute
    },

    "dateTime": {
        type: Date,
        default: Date.now
    }
})
orderp2pSchema.index({userId:1})


module.exports = mongoose.model('PPordRkFRLUxpcQ', orderp2pSchema, 'CT_PPordRkFRLUxpcQ');