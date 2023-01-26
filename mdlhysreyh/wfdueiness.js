var mongoose = require('mongoose')

const witness = mongoose.Schema({
    "user_id" : { type: mongoose.Schema.Types.ObjectId, ref: 'usvhyhj'},
    "tran_hash" : { type : String },
    "hexAddress" : { type : String }   
})
witness.index({user_id:1})

module.exports =  mongoose.model("widncidness", witness,"CT_widncidness" )

