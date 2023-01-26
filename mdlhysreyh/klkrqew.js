var mongoose = require('mongoose')

const kycSchema = mongoose.Schema({
    "user_id": { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    "frontImg": { type: String },
    "backImg": { type: String },
    "selfieImg": { type: String },
    "frontImgStatus": { type: Number, default: 0 }, //0-pending, 1-approved 2-rejected
    "backImgStatus": { type: Number, default: 0 },
    "selfieImgStatus": { type: Number, default: 0 },
    "reason": { type: String },
    "kycType": { type: String },
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: Date.now },
    "frontRejectReason": { type: String },
    "backRejectReason": { type: String },
    "selfieRejectReason": { type: String },
    "ewalletstatus": { type: Number } // 1 if ewallet is enabled

})
kycSchema.index({ user_id: 1, reason: 1 });

module.exports = mongoose.model("kDocsYaCs", kycSchema,"CT_kDocsYaCs")

