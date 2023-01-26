const mongoose = require('mongoose');
const contactusSchema = new mongoose.Schema({
    "name": {
        type: String
    },
    "email": {
        type: String
    },
    "mobile": {
        type: Number
    },
    "message": {
        type: String
    },
    "reply":{
        type:String,
        default:" "
    },
    "captcha": {
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


module.exports = mongoose.model('SUtcaTnOC', contactusSchema, 'CT_SUtcaTnOC');