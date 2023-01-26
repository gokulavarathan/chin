var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var cmsSchema = new Schema({
    heading: {
        type: String,
        default: "",
        index:true
    },    
    title: {
        type: String,
        default: "",
        index:true
    },
    subtitle: {
        type: String,
        default: ""
    },
    meta_keywords: {
        type: String,
        default: ""
    },
    meta_description: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('cms',cmsSchema,'CT_cms');
