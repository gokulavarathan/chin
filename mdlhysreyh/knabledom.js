var mongoose = require('mongoose')

const userBankSchema = mongoose.Schema({
 
    email:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usvhyhjs'
    },
    buyCurrency       : { type: String }, 
    paymentCurrency   : { type: String }, 
    dob:{
        type:String
    },
    transaction_amount:{
        type:String
    },
    stable_coinValue:{
        type:String
    },
    currency_code:{
        type:String
    },
    bankaccount_no:{
        type:String
    },UserBankaccount_no:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String
    },
    type:{
        type:String
    },
    approvehash:{
        type:String
    },
    asset:{
        type:String
    }

})
userBankSchema.index({ userId: 1, buyCurrency: 1 });

module.exports =  mongoose.model("hsdanka", userBankSchema,"CT_hsdanka" )

