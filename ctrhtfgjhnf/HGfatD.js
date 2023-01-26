
const speakeasy = require('speakeasy');
const userdb = require('../mdlhysreyh/usrscdsfgesdg')
const common = require('../hprftghftgj/nommoc')
const mongoose  = require('mongoose');




//tfa verify
exports.tfa_verify = async (req, res) => {
    const { tfa } = req.body;
    try {
 

  // let usermail  = req.body.email.toLowerCase();
  // var arry      = usermail.split("@");
  // let sec       = '@'+arry[1];
  // var first     = common.encrypt(arry[0]);
  // var second    = common.encrypt(sec);

  // let email = common.encrypt(req.body.email);


  var isExist = await userdb.findOne({_id:mongoose.Types.ObjectId(req.userId) });
console.log(isExist,"isExist");
      const secret = isExist.secret_key;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: tfa
      });
      console.log(verified,"verified");
      if (verified) {
        let authID = isExist._id.toString();
        let authKey = common.createPayload(authID);
        res.json({ message: "Two Factor Authentication is Successfully Verified", verified: true, "status": true, 'authKey': authKey})
      } else {
        res.json({ message: "Invalid Two Factor Authentication Code",verified: false })
      }
    } catch (error) {
   console.log(error,"err")
      res.status(500).json({ status: false, message: 'Error retrieving user' })
    };
  }
  
  
  //tfa enable/disable
  exports.twoFactorAuth = (req, res) => {
    try {
      const { tfa } = req.body
      if (req.body.tfa_status == true) {
  
        //disable
        userdb.findOne({_id:mongoose.Types.ObjectId(req.userId) }, (err, findResult) => {
        
          if (err) {
            res.json({ status: 404, message: "Error in finding user" });
            res.end();
          } else if (findResult == null || findResult == "") {
            res.json({ status: 404, message: "User Not Found" });
            res.end();
          } else {
  
            var verified = speakeasy.totp.verify({
              secret: findResult.secret_key, //secret of the logged in user
  
              encoding: "base32",
              token: tfa,
            });
        
            if (verified) {
              userdb.updateOne(
                {_id:mongoose.Types.ObjectId(req.userId) },
                { $set: { tfa_status: false } },
                (err, disableResult) => {
                  if (err) {
                    res.json({
                      status: 404,
                      message: "Unable to disable TFA",
                    });
                    res.end();
                  } else {
                    var secret = speakeasy.generateSecret({
                      length: 10,
                      name: "ChinTwo User"
                    });
                
  
                    userdb.updateOne(
                      {_id:mongoose.Types.ObjectId(req.userId) },
                      {
                        $set: {
                          secret_key: secret.base32,
                          secretotpauthurl:
                            "https://chart.googleapis.com/chart?chs=168x168&chld=M|0&cht=qr&chl=" +
                            secret.otpauth_url +
                            "",
                        },
                      },
                      (err, newTfaResult) => {
                        if (err) {
                          res.json({
                            status: false,
                            message: "Error in Generating New TwoFa",
                          });
                          res.end();
                        } else {
                          res.json({
                            status: true,
                            message: "TFA Disabled Successfully",
                          });
                          res.end();
                        }
                      }
                    );
                  }
                }
              );
            } else {
              res.json({ status: false, message: "Invalid TFA Code" });
              res.end();
            }
          }
        });
      } else {
        //enable
        userdb.findOne({_id:mongoose.Types.ObjectId(req.userId) }, (err, userFind) => {
          if (err) {
            res.json({ status: 404, message: "Error in finding user" });
            res.end();
          } else if (userFind == null || userFind == "") {
            res.json({ status: 404, message: "user Not Found" });
            res.end();
          } else {
            var verified = speakeasy.totp.verify({
              secret: userFind.secret_key,
              encoding: "base32",
              token: tfa,
            }); 
        
  
            if (verified) {
              userdb.updateOne(
                {_id:mongoose.Types.ObjectId(req.userId) },
                { $set: { tfa_status: true } },
                (err, updateTfaResult) => {
                  if (err) {
                    res.json({
                      status: false,
                      message: "Error in Updating TFA",
                    });
                    res.end();
                  } else {
                    res.json({
                      status: true,
                      message: "TFA Enabled Successfully",
                    });
                    res.end();
                  }
                }
              );
            } else {
              res.json({ status: false, message: "Invalid TFA Code" });
              res.end();
            }
          }
        });
      }
  
  
    } catch (error) {
      res.json({ status: 404, message: error });
      res.end();
    }
  };

  //user details
  exports.getUserDetails = async (req,res)=>{

		 userdb.findOne({ _id: mongoose.Types.ObjectId(req.userId) },(err,userInfo)=>{
       if(userInfo){
         res.status(200).send({"status":true, data: userInfo})
       }
     });
     
  }