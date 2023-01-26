const mongoose = require('mongoose');

let emailtemplateSchema = new mongoose.Schema({
  "title"		: { type: String, index: true },
  "subject" 	: String,
  "content" 	: String,
  "created_at"	: { type: Date, default: Date.now },
  "updated_at"  : { type: Date, default: Date.now }
},{"versionKey" : false});
emailtemplateSchema.index({title:1})
module.exports = mongoose.model('xjgvvna', emailtemplateSchema,'CT_xjgvvna');