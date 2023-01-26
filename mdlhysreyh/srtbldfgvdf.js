const mongoose = require('mongoose');
const contactusSchema = new mongoose.Schema({
    "user_id": {
        type: String
    },
    "fromAdd": {
        type: String
    },
    "amount": {
        type: Number
    },
    "toAdd": {
        type: String
    },
    "transaction_id":{
        type:String,
        default:" "
    },
    "currency": {
        type: String
    },
    "type": {
        type: String
    },
    
    "name": {
        type: String
    },
    "note": {
        type: String
    }, "approvehash": {
        type: String
    },
    "status": {
        type: Number,
        default: 0 //0 - pending, 1 - replied
    },
    "dateTime": {
        type: Date,
        default: Date.now
    }
})
contactusSchema.index({name:1})


module.exports = mongoose.model('CT_srtbl', contactusSchema, 'CT_srtbl');