const mongoose              = require('mongoose');

var usersActivitySchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },    
    ip_address: {
        type: String,
        default: ""
    },
    activity: {
        type: String,
        default: ""
    },
    user_id: {
        type: String,
        default: ""
    },
    os_name: {
        type: String,
        default: ""
    },
    browser_name: {
        type: String,
        default: ""
    },
    is_invalid: {
        type: String,
        default: ""
    },
    // type: {
    //     type: String,
    //     default: ""
    // },
    location: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    loc: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
});

module.exports = User_activity_model = mongoose.model("CT_usrhstry",usersActivitySchema,"CT_usrhstry");
