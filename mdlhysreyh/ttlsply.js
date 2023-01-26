const mongoose = require('mongoose');

let supplySchema = new mongoose.Schema({
    "ChinTwo"         : { type: String },
    "CUSD"       : { type: String }

});
supplySchema.index({user_id:1})

module.exports = mongoose.model('CT_sply', supplySchema,'CT_sply');
