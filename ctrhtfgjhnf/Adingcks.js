const mongoose = require('mongoose');
const Request = require('request');
const Helper = require('../hprftghftgj/nommoc');
const Common = require('../hprftghftgj/nommoc.js');
const express = require('express');
var async = require("async");
const contractURL = Helper.contractAddress();
const stacking = require('../mdlhysreyh/gnikcats')

module.exports.poststack = async (req, res) => {
    try{
        var data = req.body
        
        let userId = mongoose.Types.ObjectId(req.userId);

        let obj={
            "userId":userId,
            "walletAddress":data.walletAddress,
            "hash":data.hash,
            "amount":data.amount,
            "resource":data.resource,
            "time":data.time,
            "type":data.type,
           

        }
        stacking.create(obj, (err, created) => {
            if (created) {
                res.json({ status: true, msg: "Staked Successfull" });

            } else {
                
                res.json({ status: false, msg: "Something went wrong ==>" });
            }
        })

    }catch (e){      
            res.json({ status: false, msg: 'Something went wrong ==> ' + e });        
    }

}

module.exports.getStacked = async(req,res)=>{
    try{
        var data = req.body
        
        let userId = mongoose.Types.ObjectId(req.userId);

        
        stacking.find(userId, (err, result) => {
            
            if (!err) {
                res.json({ status: true, msg: "Stacked History",data: result});

            } else {
                
                res.json({ status: false, msg: "Something went wrong ==>" });
            }
        })

    }catch (e){      
            res.json({ status: false, msg: 'Something went wrong ==> ' + e });        
    }
}

module.exports.getStacked123 = async(req,res)=>{
    const userTblData = await usersTbl.findOne({ user_id: mongoose.Types.ObjectId(req.userId) });
if (userTblData) {

  const kycTblData = await kycTbl.findOne({ user_id: mongoose.Types.ObjectId(req.userId), frontImgStatus: 1, backImgStatus: 1, selfieImgStatus: 1, ewalletstatus: 0 },)

  if (kycTblData) {
      
  }
}
}