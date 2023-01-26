const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema({
    AdminName       : { type: String ,default:"Chin Two Admin" },
    SiteName       : { type: String ,default:"Chin Two" },
    sitelogo    : { type: String  },
    favicon     : { type: String },
    Email       : { type: String ,default:"Chintwo@gmail.com" },
    Contact     : { type: String,default:"44 6215625"  },
    Copyrightstext:{ type: String,default:"copyright © 2022 all rights reserved"  },
    Facebook    : { type: String , default:"www.facebook.com" },
    Youtube     : { type: String , default:"www.youtube.com" },
    Twitter     : { type: String , default:"www.twitter.com" },
    Telegram    : { type: String , default:"www.telegram.com" },
    LinkedIn    : { type: String , default:"www.linkedin.com" },
    Instagram   : { type: String , default:"www.instagram.com" },
    p2p_timer   : { type: Number  },
    ProposalFee : { type: Number, default:0 },
    TokenDeployFee : { type: Number, default:0 }
});
siteSettingSchema.index({AdminName:1})

module.exports = mongoose.model("stngsekd ", siteSettingSchema,"CT_stngsekd");
