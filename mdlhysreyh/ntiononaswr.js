const mongoose = require('mongoose');
const p2pNotificationSchema = new mongoose.Schema({
    "userId":{
        type:mongoose.Schema.Types.ObjectId,
        // ref:'p2p_user'
    },
    "avatar":{
        type:String
    },
    "message":{
        type:String
    },
    "referenceId":{
        type:String
    },
    "status":{
        type:Number,
        default:0
    },
    "keyValue":{
        type:String
    },
    "dateTime":{
        type:Date,
        default:Date.now
    }
})
p2pNotificationSchema.index({userId:1})

module.exports = mongoose.model('PPnoiTAcIfitoN', p2pNotificationSchema, 'CT_PPnoiTAcIfitoN');