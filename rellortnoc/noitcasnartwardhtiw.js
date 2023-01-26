const express = require('express');
const md5 = require("md5");
const getRequestCurl = require('./lructseuquerteg');
const queryHelpher=require("../hprftghftgj/yreuq");
const mongoose=require('mongoose')
const bank=mongoose.model('hsdanka')
require('dotenv').config()
const user = require ('../mdlhysreyh/usrscdsfgesdg')
const fiatbankTbl=require('../mdlhysreyh/knabledom')
const common =require("../hprftghftgj/nommoc")

const async     = require('async');

async function WithdrawTransaction(req, res) {
  var uniqueId;
  var respon;
  var challangeToken;
  var getParams = {
    operation: "getchallenge",
    username: process.env.USER_NAME,
  };
  var transaction_type = 'In';

  const { email, dob, transaction_amount,stable_coinValue,asset, bankaccount_no, currency_code ,type} = req.body;
  

  var dataRes = await getRequestCurl.getHttpRequest(getParams);
  if (dataRes.success) {
    

    challangeToken = dataRes.result.token;
    if (challangeToken != '') {
      var newAccessKey = md5(`${challangeToken}${process.env.ACCESS_KEY}`);

      var postParams = {
        operation: 'login',
        username: process.env.USER_NAME,
        accessKey: newAccessKey
      };
      var postData = await getRequestCurl.postHttpRequest(postParams);
      

      var sessionName = postData.result.sessionName;
   
    
    

      var user_2 = {
        email: email,
        userId:req.userId,
        dob: dob,
        transaction_type: transaction_type,
        transaction_amount: transaction_amount,
        bankaccount_no: "56853654",
        currency_code: currency_code,
        type:"withdraw",
        asset:asset,
        stable_coinValue:stable_coinValue
      };
      
      var paramsGetHolder = {
        operation: 'Transaction',
        sessionName: sessionName,
        element: JSON.stringify(user_2),
      };

      var response2 = await getRequestCurl.postHttpRequest(paramsGetHolder);
      user_2 = {
        ...user_2,
        UserBankaccount_no: response2.result.bankaccount_no,
      }
      queryHelpher.insertData("hsdanka",user_2,(response)=>{
        uniqueId = response._id

        var data={
          uniqueId:uniqueId,
          userId:req.userId,
          amount:parseFloat(stable_coinValue) ,
          asset:req.body.asset
  
        }
        if(response2.result.message != undefined){
  
          res.json({ "status": false, "message": response2.result.message })
        
        }else{
          witChinTransfer(data)
          res.json({ "status": true, "message": "Bank Withdraw Successfully Completed", "data": data })
          
          
        }

      })


  
    }
  }
}

const witChinTransfer =(data)=>{
  if (data.asset == "ChinTwo"){

  common.getAPI("bankwithdraw",data,function(response){
    
   if(response.status == "true"){
    
    
     let data2={
       id: data.uniqueId,
       transhash:response.approvehash,
       type : "coinTransfer"

     }
     common.getAPI("txforfiat", data2, function (ethApicontract) {
       if (ethApicontract) {
        
         
       }
     })

    

   }
   else{

    

   }
   
   
   })
  }
  else {  
    common.getAPI("bankWithdrawToken",data,function(response){
      
     if(response.status == "true"){
  
      let data2={
        id: data.uniqueId,
        transhash:response.approvehash,
        type : "tokenTransfer"
      }
      common.getAPI("txforfiat", data2, function (ethApicontract) {
        if (ethApicontract) {
         
          
        }
      })
      
     }
     else{
      

     }
     
    })
  }


}

const getFiatWithdrawList=async(req,res)=>{
  try {



    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { createdAt: -1 };

    var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
    
if(validUser){
  where={type: "withdraw", userId:validUser._id}


  async.parallel({
      
    FiatWithdrawData : function(cb) {
        
      fiatbankTbl.find( where, { _id : 0, user_id : 0 } ).skip(skip).limit(limit).sort( sort ).exec(cb);
    },

    totalRecords : function(cb) {
        
      fiatbankTbl.find( where ).countDocuments().exec(cb);
    }

  }, function(err, results) {
    

    var data  = (results.totalRecords > 0) ? results.FiatWithdrawData : [];
    var count = (results.totalRecords) ? results.totalRecords : 0;

    return res.json({status:true, data:data, count:count })
  
  })





}else{
  res.json({ "status": false, "message": "Not a user", })
}


} catch (e) {
    
    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
}
  

}


module.exports = {WithdrawTransaction,getFiatWithdrawList};
