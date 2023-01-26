const mongoose = require('mongoose');

let currencySchema = new mongoose.Schema({
  "name"			: { type: String},
  "coordinates" 			: { type: Array},

},{"versionKey" : false});
currencySchema.index({name:1})

module.exports = mongoose.model('CT_cntry', currencySchema,'CT_cntry');