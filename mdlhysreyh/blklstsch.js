const mongoose = require('mongoose');
const config = require('../nddetdthtfjh/config');

const blocklistSchema = new mongoose.Schema({
    "ip": {
        type: String,
        default: ""
    },
    "status": {
        type: Number,
        default: 1
    },
    "datetime": {
        type: Date,
        default: Date.now
    }
})
blocklistSchema.index({ip:1})

module.exports = mongoose.model('blkltfdd', blocklistSchema,"CT_blkltfdds" )