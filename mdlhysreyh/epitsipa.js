var mongoose = require('mongoose')

const stripeSchema = mongoose.Schema({
    amount:{
        type:String
    },
  
    currency:{
        type:String
    },
    description:{
        type:String
    },
    card:{
     type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:String
    }
 
  

})
stripeSchema.index({ amount: 1, currency: 1 });

module.exports =  mongoose.model("LHFrWaNrqg", stripeSchema,"CT_lhfrwanrqg" )

