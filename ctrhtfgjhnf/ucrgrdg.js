const express = require('express');
const mongoose = require('mongoose');
const Request = require('request');
const mailfn = require('../hprftghftgj/laimsd');
const speakeasy = require('speakeasy');
const contract = require('../hprftghftgj/tcartnac.js');
const common = require('../hprftghftgj/nommoc.js');
const disposal = require('../hprftghftgj/disposal_email');
const currency = require('../mdlhysreyh/cixdnxr');
const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
const cointoken = require('../mdlhysreyh/bunotsp')
const BlockWeb = require("blockweb")
const contractAddress = common.contractAddress();
const contactusDB = require('../mdlhysreyh/sutcatnoc');
const transactionList = require('../mdlhysreyh/tsiLnoitcasnart');
const tokenStake = require('../mdlhysreyh/ekastsnekot');
const async = require('async');
const cmsModel = require('../mdlhysreyh/smsdfd');
const siteSettingSchema = require('../mdlhysreyh/sitstgsgfs');
const allTokensList = require('../mdlhysreyh/tsiLnekotTlla')


exports.register = async (req, res) => {

  try {

    const temp_secret = speakeasy.generateSecret({
      length: 10,
      name: "Chin Two User"
    });

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    if (reqType == 'CREATE_USER') {

      var isExist = await usersTbl.find({ 'protect_key': reqData.email });

      if (isExist.length == 0) {

        var mailFormat = reqData.email.substring(reqData.email.lastIndexOf("@") + 1);

        if (disposal.indexOf(mailFormat) > -1) {

          return res.json({ status: false, msg: "This email address is not allowed." });
        }

        let usermail = reqData.email.toLowerCase();
        var arry = usermail.split("@");
        let sec = '@' + arry[1];
        var first = common.encrypt(arry[0]);
        var second = common.encrypt(sec);

        let email = common.encrypt(reqData.email);
        let pwd = common.encrypt(reqData.pwd);
        let DOB = reqData.dob;

        const oldUser = await usersTbl.findOne({ 'protect_key': first, 'unusual_key': second });

        if (oldUser) {
          return res.json({ status: false, msg: 'User Already Exist. Please Login' });

        }

        Request(contractAddress + '/generateaddress', function (error, response, body) {

          if (response.statusCode === 200) {
            body = JSON.parse(body);
            let privateKey = body['privateKey'];
            let address = body['address'];
            let hexAddress = body['hexAddress'];
            let totalLength = privateKey.length;
            let divideValue = totalLength / 2;
            let partOne = privateKey.substring(0, divideValue);
            let partTwo = privateKey.substring(divideValue, totalLength);
            partOne = common.encrypt(partOne);
            partTwo = common.encrypt(partTwo);

            let object = {
              'protect_key': first, 'unusual_key': second, 'security_key': pwd, 'address': address, 'hexAddress': hexAddress, 'aceRandom': partTwo, 'endRandom': partOne, secret_key: temp_secret.base32,
              secretotpauthurl:
                "https://chart.googleapis.com/chart?chs=168x168&chld=M|0&cht=qr&chl=" +
                temp_secret.otpauth_url + "", 'dob': DOB, E_wallet: false, Token_Deploy: false
            };
            usersTbl.create(object, async function (err, resData) {

              if (!err) {

                mailTemplateTbl.findOne({ "title": "register" }, (err, temp) => {

                  if (err) {

                    return res.json({ status: false, msg: 'Mail template not found.' });

                  } else {

                    var tempContent = temp.content;
                    var subject = temp.subject;
                    var usermail = common.decrypt(email);
                    var encryptID = resData._id;
                    var activeLink = common.siteUrl(req) + 'activate/' + encryptID;


                    var tempContent = temp.content.replace(/###COPY###/g, 'copyright@2022').replace(/###registerverify_link###/g, activeLink).replace(/###name###/g, usermail);


                    mailfn.sendMail(subject, { to: usermail, html: tempContent }, function (mailRes, err) {

                      if (mailRes) {

                        return res.json({ status: true, msg: 'Registered Successfully. Activation link has been sent to your registered email.' });

                      } else {

                        return res.json({ status: false, msg: 'Mail error : Please try again later.' });
                      }

                    })
                  }

                })

              } else {

                res.json({ status: false, msg: err });
              }

            })

          } else {

            return res.json({ status: false, msg: "Please Try again later." });
          }

        });

      } else {

        res.json({ status: false, msg: 'Email address already exist.' });
      }

    } else {

      res.json({ status: false, msg: 'Access denied.' });
    }

  } catch (e) {



    res.json({ status: false, msg: 'Something went wrong.' });
  }

}


exports.accountActivation = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    if (reqType == 'ACCOUNT_ACTIVATION') {

      let id = reqData;

      var isExist = await usersTbl.findOne({ '_id': mongoose.mongo.ObjectId(id) });

      if (isExist) {

        var output = isExist;

        let title, msg;

        let acStatus = output.ac_status;

        if (output.ac_status == 1) {

          msg = 'Your account has been already activated.';

          res.json({ status: false, msg: msg, acStatus: acStatus });

        } else if (output.ac_status == 2) {

          msg = 'Your account has been suspended or blocked by admin. Please contact us our administrator';

          res.json({ status: false, msg: msg, acStatus: acStatus });

        } else {

          usersTbl.updateOne({ _id: mongoose.mongo.ObjectId(id), ac_status: 0 }, { $set: { ac_status: 1 } }, function (error, modified) {

            if (modified) {

              msg = 'Your account has been activated Successfully. ';

              res.json({ status: true, msg: msg, acStatus: 1 });

            } else {

              res.json({ status: false, msg: 'Activation failed. Please try again after some times.', acStatus: 0 });
            }

          })
        }

      } else {

        res.json({ status: false, msg: 'Invalid account activation link.', acStatus: 0 });
      }

    } else {

      res.json({ status: false, msg: 'Access denied.', acStatus: 0 });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.', acStatus: 0 });
  }

}


exports.testing = async (req, res) => {

  try {

    res.json({ status: true, msg: 'API is working fine.' });

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong ==> ' + e });
  }

}

exports.provide_PrivateKey = async (req, res) => {

  try {

    let getsData = { hexAddress: 1, aceRandom: 1, endRandom: 1 }

    var validUser = await usersTbl.findOne({ _id: mongoose.Types.ObjectId(req.userId) }, getsData);
    if (validUser) {

      var pvtkey1 = common.decrypt(validUser.endRandom)
      var pvtkey2 = common.decrypt(validUser.aceRandom)
      var pvtkey = pvtkey1 + pvtkey2



      res.json({ status: true, "Private_Key": pvtkey, "Hex_Address": validUser.hexAddress, "Address": validUser.address });


    }
    else {

      res.json({ status: false, message: "Invalid user ID" });
    }


  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong ==> ' + e });
  }

}

//get list of approved tokens

exports.ApprovedTokenList = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqData = reqParam.payload;
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };

    async.parallel({

      ApprovedUserTokenList: function (cb) {

        cointoken.find({ type: "userToken" }).skip(skip).limit(limit).sort(sort).exec(cb);
      },

      totalRecords: function (cb) {

        cointoken.find({ type: "userToken" }).countDocuments().exec(cb);
      },

    }, function (err, results) {

      var data = (results.totalRecords > 0) ? results.ApprovedUserTokenList : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;

      return res.json({ status: true, data: data, count: count })

    }
    )



  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong ==> ' + e });
  }

}

//contact us 
exports.contactus = async (req, res) => {

  try {
    let data = req.body;

    if (!data.name) {
      res.json({ status: false, msg: "name required!" })
    }
    else if (!data.email) {
      res.json({ status: false, msg: "email required!" })
    }
    else if (!data.mobile) {
      res.json({ status: false, msg: "mobile required!" })
    }
    else if (!data.message) {
      res.json({ status: false, msg: "message required!" })
    }
    else {
      let contactData = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        message: data.message,
        captcha: data.captcha
      }
      contactusDB.create(contactData, (err, created) => {
        if (!err && created) {
          res.json({
            status: true,
            msg: "Submitted Successfully",
          });
        } else {
          res.json({
            status: false,
            msg: "Error occurred in contact us. Please try again later",
          });
        }
      });

    }
  } catch (err) {

    res.json({
      status: false,
      msg: "Oops! Something went wrong. Please try again later",
    });
  }
};



exports.totalContracts = (req, res) => {
  try {

    let TokenData;
    allTokensList.find({ "status": 1 }).exec((err, totalCount) => {
      if (totalCount) {

        let totalDeploy = totalCount.length;


        cointoken.findOne({ 'symbol': "Chin" }, (err, CoinInfo) => {
          if (!err && CoinInfo) {
            let TokenData1 = { ...CoinInfo }._doc;
            let TokenData = TokenData1.chinUSD

            res.json({ 'status': true, 'totalDeploy': totalDeploy, 'TokenData': TokenData })

          }
          else {
            console.log("error");

          }
        })
      }
      else {
        console.log("err");
      }
    })


  }
  catch (e) {
    res.json({
      status: false,
      msg: "Oops! Something went wrong. Please try again later",
    });
  }
}




//dashboard user daily transfer 
exports.dailyTransfer = async (req, res) => {
  try {
    var chindata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var tokendata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var overalldata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var freezedata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var concData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    async.parallel({
      chinHistory: function (cb) {
        var Where = { buyCurrency: 'CHIN', from: 'ChinTwo' };
        transactionList.aggregate([
          {
            "$match":
            // Where
            {
              "$and": [
                {
                  "$or": [
                    { buyCurrency: 'CHIN' },
                    { from: 'ChinTwo' }
                  ]
                },
              ]
            }

          },
          { $project: { '_id': 0, 'Month': { $month: "$created_at" }, amount: { $sum: '$amount' } } },
          { $group: { '_id': '$Month', 'amount': { $sum: '$amount' } } },
        ]).exec(cb)
      },
      TokenHistory: function (cb) {
        var Where = { buyCurrency: 'CUSD' };
        transactionList.aggregate([
          { $match: Where },
          { $project: { '_id': 0, 'Month': { $month: "$created_at" }, amount: { $sum: '$amount' } } },
          { $group: { '_id': '$Month', 'amount': { $sum: '$amount' } } },
        ]).exec(cb)
      },
      ContractHistory: function (cb) {
        var Where = { Transfer_type: 'TransferContract' };
        transactionList.aggregate([
          { $match: Where },
          { $project: { '_id': 1, 'Month': { $month: "$created_at" }, supply: { $sum: 1 } } },
          { $group: { '_id': '$Month', 'supply': { $sum: 1 } } },
        ]).exec(cb)
      },
      feeCon: function (cb) {
        transactionList.aggregate([
          { $project: { '_id': 1, 'Month': { $month: "$created_at" }, fee: { $sum: '$fee' } } },
          { $group: { '_id': '$Month', 'fee': { $sum: '$fee' } } },
        ]).exec(cb)
      },
      freezeRes: function (cb) {
        var Where = { type: 'stake' };
        tokenStake.aggregate([
          { $match: Where },
          { $project: { '_id': 0, 'Month': { $month: "$createdDate" }, amount: { $sum: '$amount' } } },
          { $group: { '_id': '$Month', 'amount': { $sum: '$amount' } } },
        ]).exec(cb)
      },
      usersRes: function (cb) {
        usersTbl.find().sort({ "_id": -1 }).countDocuments().exec(cb)
      },
      actuserRes: function (cb) {
        usersTbl.find({ ac_status: 1 }).sort({ "_id": -1 }).countDocuments().exec(cb)
      }
    }, function (err, results) {

      if (err) return res.status(500).send(err);
      let chinHistory = results.chinHistory;
      let TokenHistory = results.TokenHistory;
      let usersRes = results.usersRes;
      let actuserRes = results.actuserRes;
      let ContractHistory = results.ContractHistory;
      let feeCon = results.feeCon;
      let freezeHis = results.freezeRes;
      for (var j = 0; j < chinHistory.length; j++) {
        if (chinHistory[j]._id > 0) {
          chinHistory[j]._id = chinHistory[j]._id - 1;
        }
        chindata[chinHistory[j]._id] = chinHistory[j].amount;
      }
      for (var j = 0; j < TokenHistory.length; j++) {
        if (TokenHistory[j]._id > 0) {
          TokenHistory[j]._id = TokenHistory[j]._id - 1;
        }
        tokendata[TokenHistory[j]._id] = TokenHistory[j].amount;
      }
      for (var k = 0; k < ContractHistory.length; k++) {
        if (ContractHistory[k]._id > 0) {
          ContractHistory[k]._id = ContractHistory[k]._id - 1;
        }
        concData[ContractHistory[k]._id] = ContractHistory[k].supply;
      }
      for (var f = 0; f < feeCon.length; f++) {
        if (feeCon[f]._id > 0) {
          feeCon[f]._id = feeCon[f]._id - 1;
        }
        overalldata[feeCon[f]._id] = feeCon[f].fee;
      }
      for (var l = 0; l < freezeHis.length; l++) {
        if (freezeHis[l]._id > 0) {
          freezeHis[l]._id = freezeHis[l]._id - 1;
        }
        freezedata[freezeHis[l]._id] = freezeHis[l].amount;
      }
      res.json({ status: true, freezedata: freezedata, usersRes: usersRes, actuserRes: actuserRes, chindata: chindata, overalldata: overalldata, tokendata: tokendata, concData: concData });
    });
  } catch (e) {
    res.json({ status: false, msg: e, chinHistory: [], TokenHistory: [] });
  }
};


exports.getCms = (req, res) => {
  try {
    cmsModel.find()
      .sort({ _id: -1 })
      .exec((cerr, cdata) => {
        if (cerr) {
          res.json({
            status: false,
            message: "No cms found",
          });
          res.end();
        } else {
          res.json({
            status: true,

            data: cdata,
          });
          res.end();
        }
      });
  } catch (err) {
    res.json({
      status: false,
      message: "No cms found",
    });
    res.end();
  }
};


//get site settings
exports.getSettings = (req, res) => {

  try {
    siteSettingSchema.findOne({}, { _id: 0 }, (err, data) => {
      console.log(data, "data");
      console.log(err, "err");
      if (!err) {

        res.json({ "status": true, "data": data })

      }
    })

  } catch (e) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}
