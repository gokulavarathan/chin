const express   = require('express');
const mongoose  = require('mongoose');
const async     = require('async');
const mailfn    = require('../hprftghftgj/laimsd');
const common    = require('../hprftghftgj/nommoc.js');
const s3bucket  = require('../hprftghftgj/tekcub3s.js'); 
const usersTbl        = require('../mdlhysreyh/usrscdsfgesdg');
const currencyTbl     = require('../mdlhysreyh/cixdnxr');
const fiatCurrencyTbl  = require('../mdlhysreyh/bunotsp');
const withdrawTbl      = require('../mdlhysreyh/wdidrth');
const adminBankTbl    = require('../mdlhysreyh/adxnygj');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');

const cointoken = require('../mdlhysreyh/bunotsp')



exports.submitCryptoWithdraw = async (req,res) => {

  try {
    
    let reqParam = req.body;
    let reqType  = reqParam.type;
    let reqData  = reqParam.payload;
    
    
    var isExist = await usersTbl.findOne({ _id : mongoose.Types.ObjectId(req.userId), ac_status : 1 }).countDocuments();
    var isKycExist = await usersTbl.findOne({ user_id: mongoose.mongo.ObjectId(req.userId)})


    if(isExist > 0) 
    { 
      if (isKycExist.kyc_status==1){
   
        let object = {
          'user_id'         : req.userId,
          'amount'          : reqData.amount,
          'receivingAmount'   : reqData.receivingAmount,
          'sellCurrency'    : reqData.sellCurrency,
          'receivingCurrency': reqData.receivingCurrency,
          'walletAddress'   : reqData.walletAddress,
          'paymentType': +reqData.paymentType,
          'status'          : 0,
          'withdrawType'     : 0,
          
        }

      

        withdrawTbl.create(object, async function(err,resData){
          
          if(!err) {
            res.json({ status : 200, msg : 'Withdraw request has been submitted successfully.'});

          } else {
                      
            res.json({ status : 404, msg : "You cannot make this transaction"});
          }
        
        })

      } else {
        
        return res.json({status:false, msg:'Complete your KYC to make this transaction' })
      }
    } else {
        
      res.json({status:404, msg:'Invalid user.'});
    }

  } catch(e) {
    
    res.json({status:false,msg:'Something went wrong.'});
  }
}

exports.getCryptoWithdrawHistory = (req,res) => {
  
  try {
    
    let reqParam = req.body;
    let reqType  = reqParam.type;
    let reqData  = reqParam.payload;
    
    let pageNo   = (reqData.page) ?  reqData.page : '0';
    let pageSize = (reqData.pageSize) ?  reqData.pageSize : '0';
    var skip     = +pageNo * pageSize;
    var limit    = +pageSize;
    var sort     = {created_at : -1};

    var where = { withdrawType : 0, user_id : req.userId };

    async.parallel({
      
      withdrawData : function(cb) {
          
        withdrawTbl.find( where, { _id : 0} ).skip(skip).limit(limit).sort( sort ).exec(cb);
      },

      totalRecords : function(cb) {
          
        withdrawTbl.find( where ).countDocuments().exec(cb);
      }

    }, function(err, results) {
    
      var data  = (results.totalRecords > 0) ? results.withdrawData : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;

      return res.json({status:true, data:data, count:count })
    
    })

  } catch(e) {

    return res.json({status:200,msg:'Something went wrong'});
  }
}



exports.getFiatWithdrawHistory = (req,res) => {
  
  try {
    let reqParam = req.body;
    let reqType  = reqParam.type;
    let reqData  = reqParam.payload;
    
    let filter   = (reqData.filtered) ?  reqData.filtered : '';
    let pageNo   = (reqData.page) ?  reqData.page : '0';
    let pageSize = (reqData.pageSize) ?  reqData.pageSize : '0';
    var skip     = +pageNo * pageSize;
    var limit    = +pageSize;
    var sort     = {created_at : -1};

    var where = { withdrawType : 1, user_id : req.userId };

    async.parallel({
      
      withdrawData : function(cb) {
          
        withdrawTbl.find( where, { _id : 0, user_id : 0 } ).skip(skip).limit(limit).sort( sort ).exec(cb);
      },

      totalRecords : function(cb) {
          
        withdrawTbl.find( where ).countDocuments().exec(cb);
      }

    }, function(err, results) {
      

      var data  = (results.totalRecords > 0) ? results.withdrawData : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;

      return res.json({status:true, data:data, count:count })
    
    })

  } catch(e) {

    return res.json({status:false,msg:'Something went wrong'});
  }
}


//get balance
exports.getbalance = async (req,res)=>{
try{

  let reqParam = req.body;
  let reqType  = reqParam.type;
  let reqData  = reqParam.payload;

  var isExist = await usersTbl.findOne({ _id : mongoose.mongo.ObjectId(req.userId)}).countDocuments();
      if(isExist > 0) 
      { 





           res.json("isbalExist")
        }
        else {
          res.json({status:404, msg:'Invalid user.'});
        }


}catch(e){
  
  res.json({status:false,msg:'Something went wrong.'});
}
  
}

