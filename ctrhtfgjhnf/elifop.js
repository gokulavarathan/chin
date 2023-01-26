const express   = require('express');
const mongoose  = require('mongoose');
const mailfn    = require('../hprftghftgj/laimsd');
const common    = require('../hprftghftgj/nommoc.js');
var async        = require("async");

const usersTbl        = require('../mdlhysreyh/usrscdsfgesdg');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
const transactionList = require('../mdlhysreyh/tsiLnoitcasnart');


exports.getProfile = async (req,res) => {

  try {
        let reqParam = req.body;
        let reqType  = reqParam.type;
        let reqData  = reqParam.payload;
      if(reqType == 'USER_PROFILE') {

        let gets = { _id : 1, protect_key : 1, unusual_key : 1, user_name : 1, mobile_no : 1, zip_code : 1, dob : 1, kyc_status:1, ac_status:1 };
  
        var isExist = await  usersTbl.find({ '_id':mongoose.mongo.ObjectId(req.userId), 'ac_status':1 });
        if(isExist.length > 0) {
  
          let profileData = isExist[0];
  
              profileData['protect_key'] = common.decrypt(profileData.protect_key)+common.decrypt(profileData.unusual_key);
              
                  var  transactionCount= await transactionList.findOne({"user_id":req.userId}).countDocuments().exec();
          res.json({ status : true, data : profileData,transactions:transactionCount });

        }else {
        
          res.json({ status : false, msg : 'Invalid user details' });
        }
  
      } else {
        
        res.json({ status : false, msg:'Access denied.'});
      }



} catch(e) {

    res.json({status:false,msg:'Something went wrong.'});
  }

}


exports.updateProfile = async (req,res) => {

  try {
    
    let reqParam = req.body;
    let reqType  = reqParam.type;
    let reqData  = reqParam.payload;

    if(reqType == 'UPDATE_PROFILE') {

      let gets = { _id : 0, user_name : 1, mobile_no : 1 ,dob:1,country:1};

      var isExist = await usersTbl.find({ '_id':mongoose.mongo.ObjectId(req.userId), 'ac_status':1 }, gets);

      if(isExist.length > 0) {

        let usernameExist = await usersTbl.find({user_name : reqData.user_name, _id : {$ne : mongoose.mongo.ObjectId(req.userId)}}).countDocuments();

        if(usernameExist == 0) {

          let mobileExist = await usersTbl.find({mobile_no : reqData.mobile_no, _id : {$ne : mongoose.mongo.ObjectId(req.userId)}}).countDocuments();

          if(mobileExist == 0) {

            let updateObject = { user_name : reqData.user_name, mobile_no : reqData.mobile_no, zip_code : reqData.zip_code, dob : reqData.dob , country:reqData.country, profileStatus:true};

            usersTbl.updateOne({'_id':mongoose.mongo.ObjectId(req.userId)}, { $set : updateObject }, function(error, updated){

              res.json({ status : true, msg : 'updated successfully.' });
            
            })

          } else {

            res.json({ status : false, msg : 'Mobile number already exist.' });
          }

        } 
      
      } else {
        
        res.json({ status : false, msg : 'Invalid user details.' });
      }

    } else {
      
      res.json({ status : false, msg:'Access denied.'});
    }

  } catch(e) {

    res.json({status:false,msg:'Something went wrong.'});
  }

}