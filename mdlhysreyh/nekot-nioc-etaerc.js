const mongoose = require('mongoose');


const coinTokenSchema = new mongoose.Schema({
    "name": {
        type: String,
        default: ""
    },
    "symbol": {
        type: String,
        default: 1
    },
    "deposit_status": {
        type: Number,
        default: 1
    },
    "withdraw_status": {
        type: Number,
        default: 1
    },
    "value": {
        type: Array,
       
    },
    "fee": {
        type: Number,
      
    },
    "address": {
        type: String,
       
    },
    "hexAddress": {
        type: String,
       
    },
})
coinTokenSchema.index({name:1})

module.exports = mongoose.model('CnTkn', coinTokenSchema)