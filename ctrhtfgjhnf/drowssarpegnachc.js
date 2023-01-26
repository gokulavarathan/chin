const express = require('express');
const mongoose = require('mongoose');
const mailfn = require('../hprftghftgj/laimsd');
const common = require('../hprftghftgj/nommoc.js');
var validator = require('node-validator');
const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
const adToken = require('../mdlhysreyh/frgtpswd');

exports.changePassword = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    if (reqType == 'CHANGE_PASSWORD') {

      let oldPwd = common.encrypt(reqData.oldpwd);

      var isExist = await usersTbl.find({ '_id': mongoose.mongo.ObjectId(req.userId), 'security_key': oldPwd }, { _id: 1, ac_status: 1 });

      if (isExist.length > 0) {

        let newPwd = common.encrypt(reqData.pwd);

        if (oldPwd === newPwd) {

          res.json({ status: false, msg: 'Your old and new password is same.' });

        } else {

          usersTbl.updateOne({ _id: mongoose.mongo.ObjectId(req.userId) }, { $set: { security_key: newPwd } }, function (error, modified) {

            if (modified) {

              res.json({ status: true, msg: 'Your password has been updated successfully.' });

            } else {

              res.json({ status: false, msg: 'Password update has been failed.' });
            }

          })

        }

      } else {

        res.json({ status: false, msg: 'Invalid Old Password.' });
      }

    } else {

      res.json({ status: false, msg: 'Access denied.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }

}


exports.forgot = async (req, res) => {
 
  const {email}=req.body
  try {

    let encryptedmail = common.encrypt((email).split("@")[0]);
    let encryptedmail2 = common.encrypt('@'+(email).split("@")[1]);
    
    usersTbl.findOne({protect_key: encryptedmail,unusual_key:encryptedmail2  }, (err, data) => 
    {
      if (!data) {

        res.json({ status: 400, message: "Email doesn't exist" });
      }
      else 
      {

          var currentDate = new Date();
          var twenty= currentDate.setTime(currentDate.getTime() + 20*60*1000);
          var encid=Math.random().toString(36).substring(2, 15) +Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

          
            adToken.create({ userId: data._id, token: encid ,keyGenetd:twenty, type:'forgot-password'},async(err,token2)=>
            
            {
              if(!err){

                mailTemplateTbl.findOne({ "title": "forgot password" }, (err, temp) => {
                  if (err) {

                    return res.json({ status: false, msg: 'Mail template not found.' });

                  } else {

                    var tempContent = temp.content;
                    var subject = temp.subject;
                    var encryptID=token2.token
                    console.log(encryptID,"--------------encryptID");
                    // const activeLink = `https://demo.chintwo.com/reset-password/${token2.token}`;
                    var activeLink = common.siteUrl(req) + 'reset-password/' + encryptID;
                    console.log(activeLink,"activeLink----------------");
                    var tempContent = temp.content.replace(/###COPY###/g, 'copyright@2022').replace(/###registerverify_link###/g, activeLink);
              
                    mailfn.sendMail(subject, { to: email, html: tempContent }, function (mailRes, err) {
                
                      if (mailRes) {

                        return res.json({ status: true, msg: 'Password Reset link sent to your E-mail' });

                      } else {
                        
                        return res.json({ status: false, msg: 'Mail error : Please try again later.' });
                      }

                    })
                  }

                })

              }else{

                res.json({ status: false, msg: err });
              }
               
            })
           
      
      }
    });

    
  } 
  catch (error) 
  {
    res.json({ status: 400, message: "Error occured..." });
    res.end()
   
  }
}



exports.passwordReset = async (req, res) => {

    const { password, confirmpassword } = req.body;
 

        try 
        {
          var date_now=new Date().getTime();
          let encryptedPassword = common.encrypt(password);
              adToken.findOne({token: req.body.link,type:'forgot-password'},(err,tokens)=>
              {
                if (!tokens) {
                   res.json({ status: 400, message: "Invalid link" });    
                   res.end() 
                }
                else if(tokens.keyGenetd<date_now)
                {
                  res.json({ status: 400, message: "Link expired" });    
                   res.end() 

                }
                else
                {

                  usersTbl.findOne({ _id: tokens.userId},(err,data)=>
                  {
              
                    if(!data)
                    {
                      res.json({status:400,message:"data not found"})
                    }
                    else
                    {
                     
                      usersTbl.updateOne({_id: tokens.userId},{$set: {security_key:encryptedPassword}},(err,updated)=>
                      {
                        if(updated)
                        {
                          tokens.delete()
                          res.json({ status: 200, message: "Password Updated succesfully" });
                        }
                        else{
                          res.json({ status: 400, message: "Password update has been failed. " });
                        }})                                                                                   
                      }
                  });
                }
              });
        } 
        catch (error) {
        res.json({ status: 400, message: "An error occured" });

      }
}













exports.resetPassword = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    if (reqType == 'RESET_PASSWORD') {

      if (!reqData.email) {
        res.json({ status: false, msg: 'email is required!' });
      }
      if (!reqData.pwd) {
        res.json({ status: false, msg: 'password is required!' });
      }
      if (!reqData.cpwd) {
        res.json({ status: false, msg: 'confirm password is required!' });
      }
      else {

        let usermail = reqData.email.toLowerCase();
        var arry = usermail.split("@");
        let sec = '@' + arry[1];
        var first = common.encrypt(arry[0]);
        var second = common.encrypt(sec);
        let email = {
          "arry": arry,
          "sec": sec,
          "usermail": usermail,
          "first": first,
          "second": second
        }
        var isExist = await usersTbl.findOne({ 'protect_key': first, "unusual_key": second }, { _id: 1, ac_status: 1 });

        if (isExist != null) {
          if (reqData.pwd = reqData.cpwd) {
            let newPwd = common.encrypt(reqData.cpwd);

            usersTbl.updateOne({ "_id": isExist._id }, { "$set": { "security_key": newPwd } }, function (error, modified) {
              if (!error && modified) {
                res.json({ status: true, msg: 'Your password has been changed successfully.' });
              } else {
                res.json({ status: false, msg: 'Password update has been failed.' });
              }
            })
          } else {
            res.json({ status: false, msg: 'Your old and  new password must not be same.' });
          }
        } else {
          res.json({ status: false, msg: 'Invalid user.' });
        }
      }
    } else {

      res.json({ status: false, msg: 'Access denied.' });
    }

  } catch (e) {
    
    res.json({ status: false, msg: 'Something went wrong.' });
  }

}