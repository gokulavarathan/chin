const express   = require('express');
const mongoose  = require('mongoose');
const mailfn    = require('../hprftghftgj/laimsd');
const common    = require('../hprftghftgj/nommoc.js');
const ipInfo = require("ipinfo");
var useragent = require("express-useragent");
const usersHistory = require('../mdlhysreyh/users_activity_model')
const blocklist = require('../mdlhysreyh/blklstsch')
const usersTbl        = require('../mdlhysreyh/usrscdsfgesdg');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
const os = require("os");

exports.accountLogin = async (req,res) => {

  try {
    
    let reqParam = req.body;
    let reqType  = reqParam.type;
    let reqData  = reqParam.payload;

    if(reqType == 'USER_LOGIN') {

      let usermail  = reqData.email.toLowerCase();
      var arry      = usermail.split("@");
      let sec       = '@'+arry[1];
      var first     = common.encrypt(arry[0]);
      var second    = common.encrypt(sec);

      let email = common.encrypt(reqData.email);
      let pwd   = common.encrypt(reqData.pwd);

      var isExist = await usersTbl.find({ 'protect_key' : first, 'unusual_key' : second, 'security_key' : pwd }, { _id : 1, ac_status : 1,hexAddress:1,address:1,secret_key:1,tfa_status:1,secretotpauthurl:1});

      if(isExist.length > 0) {

        let userData = isExist[0];
     


        if(userData.ac_status == 1)  {

          var nowTime = new Date();

          ipInfo((err, cLoc) => {
            // console.log(err, cLoc);
            var source = req.headers["user-agent"],
              ua = useragent.parse(source);
              // console.log(ua,"ua");
            var adminHis = new usersHistory();
            adminHis.ip_address = common.getIPAddress(req);
            adminHis.browser_name = ua.browser;
            adminHis.user_id = isExist._id;
            adminHis.os = os.type() + " " + os.release();
            adminHis.country = cLoc != undefined ? cLoc.country : "";
            adminHis.city = cLoc != undefined ? cLoc.city : "";
            adminHis.location = cLoc != undefined ? cLoc.region : "";
            adminHis.loc = cLoc != undefined ? cLoc.loc : "";
            adminHis.date = nowTime;
            adminHis.admin_email = isExist.email_id;
            adminHis.activity = "Login";
            // adminHis.type = "User S";
            adminHis
              .save()
              .then((adActivity) => {
                console.log(adActivity,"______________________---------adActivity");

               usersHistory.countDocuments({"activity":"Login"},(err,count)=>{
                console.log("-------------------> ~ count", count)

                if (count > 100){
                 usersHistory.findOneAndDelete({"activity": "Login"}, {justOne: true},(err,rews)=>{
                  console.log("-------------------> ~ rews", rews)
                 })
                
                }else{
                  console.log("less");
                }
               })


             



                    let authID = userData._id.toString();
          
                    let authKey = common.createPayload(authID);

                    mailTemplateTbl.findOne({ "title": "login" }, (err, temp) => {

                      if (err) {
    
                        return res.json({ status: false, msg: 'Mail template not found.' });
    
                      } else {
    
                        var tempContent = temp.content;
                        var subject = temp.subject;
                        var usermail = common.decrypt(email);
                        var encryptID = isExist._id;
                        // var activeLink = common.siteUrl(req) + 'activate/' + encryptID;
                    
               
                        var tempContent = temp.content.replace(/###COPY###/g, 'copyright@2022').replace(/###name###/g, usermail).replace(/###IP_ADDRESS###/g,  adminHis.ip_address).replace(/###DATETIME###/g, adminHis.date);
                  
                        blocklist.findOne({"ip":adminHis.ip_address},(err,ipcheck)=>{
                          if(!err && ipcheck){

                         console.log(ipcheck,"ipcheck");
                         console.log("blocked");
                         res.json({ status : false,  msg:'Your IP is Blocked.',});
                        } else{
    
                        mailfn.sendMail(subject, { to: usermail, html: tempContent }, function (mailRes, err) {
                    
                       if(!err && mailRes){
                              res.json({ status : true, authKey : authKey, msg:'Logged In Successfully.', Address: isExist[0].hexAddress ,secret_key: isExist[0].secret_key,
                              tfa_status: isExist[0].tfa_status, Qrcode: isExist[0].secretotpauthurl});

                              console.log(err,"err");
                          
                            } else {
                            
                              return res.json({ status: false, msg: 'Mail error : Please try again later.' });
                            }
                            })

                          }
                           
                  
                          
    
                        })
                      }
    
                    })
          
                   
              })
              .catch((err) => {});
          });




          
          
        } else if(userData.ac_status == 2) {

          res.json({ status : false, msg:'Your account has been suspended or blocked by admin.'});
        
        } else if(userData.ac_status == 0) {

          res.json({ status : false, msg:'Your account has been not yet activated.'});
        
        } else {

          res.json({ status : false, msg:'Un-authorized login credentials.'});
        }

   



      } else {

        res.json({ status : false, msg:'Invalid login Details.'});
      }
      



    } else {
      
      res.json({ status : false, msg:'Access denied.'});
    }

  } catch(e) {

    res.json({status:false,msg:'Something went wrong.'});
  }

}