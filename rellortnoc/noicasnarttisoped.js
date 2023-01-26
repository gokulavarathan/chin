const express = require('express');
const async = require('async');
var mongoose = require('mongoose');
const Helper = require('../hprftghftgj/nommoc')
const Request = require('request');
const ownerAddress = Helper.ownerAddress();
const ownerPrivateKey = Helper.ownerPrivateKey();
const contractURL = Helper.contractAddress();

const md5 = require("md5");
const getRequestCurl = require('./lructseuquerteg');
const queryHelpher = require("../hprftghftgj/yreuq");
const stripe = require("stripe")('sk_test_51KZbD0LYiBEm9htJLjDXjlD2kYYY5TZWP8ZJ1ub9KNOcuyJxwMq3OwAccLV2ngTrWHYCbQgxWxLpBzGwTrdUnxhH00S9bmVN7m');
const user = require('../mdlhysreyh/usrscdsfgesdg')
const fiatbankTbl = require('../mdlhysreyh/knabledom')
const stripeTbl = require('../mdlhysreyh/strpdtls')
const cointoken = require('../mdlhysreyh/bunotsp')
const common = require("../hprftghftgj/nommoc")
require('dotenv').config();

const BlockWeb = require('blockweb')

const { createProxyMiddleware } = require('http-proxy-middleware');

function onProxyRes(proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

}

var fullnode = express();
fullnode.use('/', createProxyMiddleware({
  target: "http://44.198.210.6:46667", //-> instance
  changeOrigin: true,
  onProxyRes
}));
fullnode.listen(56774);

var soliditynode = express();
soliditynode.use('/', createProxyMiddleware({
  target: "http://44.198.210.6:46667", //-> instance
  changeOrigin: true,
  onProxyRes,
}));
soliditynode.listen(56775);





const fullNode = "http://44.198.210.6:46667";
const solidityNode = "http://44.198.210.6:46667";
const eventServer = "http://44.198.210.6:2096";



const privateKey = 'a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b';

const blockWeb = new BlockWeb(
  fullNode,
  solidityNode,
  eventServer,
  privateKey
);




const DepositTransaction = async (req, res) => {
  var uniqueId;
  var respon;
  var challangeToken;
  var getParams = {
    operation: "getchallenge",
    username: process.env.USER_NAME,
  };

  let transaction_typ = 'Out';

  const { email, dob, transaction_amount, stable_coinValue, currency_code, type, asset } = req.body;


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
        userId: req.userId,
        dob: dob,
        transaction_type: transaction_typ,
        transaction_amount: transaction_amount,
        bankaccount_no: "56853654",
        currency_code: currency_code,
        type: "deposit",
        asset: asset,
        stable_coinValue: stable_coinValue

      }
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
      queryHelpher.insertData("hsdanka", user_2, (response) => {
        uniqueId = response._id

        var data = {
          uniqueId: uniqueId,
          userId: req.userId,
          amount: parseFloat(stable_coinValue),
          asset: req.body.asset

        }


        if (response2.result.message != undefined) {

          res.json({ "status": false, "message": response2.result.message })

        } else {
          depChinTransfer(data)
          res.json({ "status": true, "message": "Bank Deposit Successfully Completed", "data": data })


        }

      })




    }
  }
}


const getFiatDepositList = async (req, res) => {
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

    if (validUser) {
      where = { type: "deposit", userId: validUser._id }

      async.parallel({

        FiatDepositData: function (cb) {

          fiatbankTbl.find(where, { _id: 0, user_id: 0 }).skip(skip).limit(limit).sort(sort).exec(cb);
        },

        totalRecords: function (cb) {

          fiatbankTbl.find(where).countDocuments().exec(cb);
        }

      }, function (err, results) {


        var data = (results.totalRecords > 0) ? results.FiatDepositData : [];
        var count = (results.totalRecords) ? results.totalRecords : 0;

        return res.json({ status: true, data: data, count: count })

      })


    } else {
      res.json({ "status": false, "message": "Not a user", })

    }






  } catch (e) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }


}

const depChinTransfer = (data) => {
  if (data.asset == "ChinTwo") {
    common.getAPI("bankdeposit", data, function (response) {

      if (response.status == "true") {


        let data2 = {
          id: data.uniqueId,
          transhash: response.approvehash,
          type: "coinTransfer"
        }
        common.getAPI("txforfiat", data2, function (ethApicontract) {
          if (ethApicontract.status) {

          }
        })


      }
      else {



      }

    }

    )

  } else {

    common.getAPI("bankdepositToken", data, function (response) {

      if (response.status == "true") {

        let data2 = {
          id: data.uniqueId,
          transhash: response.approvehash,
          type: "tokenTransfer"
        }
        common.getAPI("txforfiat", data2, function (ethApicontract) {
          if (ethApicontract.status) {


          }
        })



      }
      else {


      }

    })
  }



}



const StripeDeposit = async (req, res) => {
  try {
    console.log(req.body, "--------------req stripe");
    const customer = await stripe.customers.create({
      shipping: {
        name: req.body.shipping.name,
        address: {
          line1: req.body.shipping.address.line1,
          postal_code: req.body.shipping.address.postal_code,
          city: req.body.shipping.address.city,
          state: req.body.shipping.address.state,
          country: req.body.shipping.address.country,
        },
      },

    });
    var customerdata = customer

    const charge = await stripe.charges.create({
      amount: req.body.amount,
      currency: req.body.currency,
      source: 'tok_mastercard',
      description: req.body.description,
      shipping: {
        name: customerdata.shipping.name,
        address: customerdata.shipping.address
      },
    });

    stripeTbl.create({
      userId: mongoose.Types.ObjectId(req.userId),
      amount: req.body.amount,
      currency: req.body.currency,
      source: 'tok_mastercard',
      description: req.body.description,
      shipping: {
        name: customerdata.shipping.name,
        address: customerdata.shipping.address
      },
      id: charge.id,
      balance_transaction: charge.balance_transaction,
      created: charge.created,
      payment_method: charge.payment_method,
      network: charge.payment_method_details.network,
      receipt_url: charge.receipt_url,
      status: charge.status,
      receipt_url: charge.receipt_url,
      //  Received_value:req.body.Received_value,
      buyAmount: req.body.buyAmount,
      buyCurrency: req.body.buyCurrency,
    }, async (err, created) => {
      console.log(err, "err");
      if (!err && created) {
        console.log(created, "created");

        if (created.status == "succeeded") {
          var buyCurrency = req.body.buyCurrency
          var depositAmt = created.buyAmount
          if (buyCurrency == "ChinTwo") {



            var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
            console.log(validUser, "validUser");
            let depositAmountt = req.body.buyAmount;
            console.log(depositAmountt, "depositAmountt");
            depositAmt = amountConvert(depositAmountt, 6, "towei")
            console.log(depositAmt, "depositAmt");

            let requestParams = { "to_address": validUser.hexAddress, "owner_address": ownerAddress, "amount": +depositAmt };
            console.log(requestParams, "requestParams");
            await Request({

              url: contractURL + "/createtransaction",
              method: "POST",
              json: true,
              body: requestParams
            },
              async function (error, response, body) {
                console.log(body, "body1");

                if (response.statusCode === 200) {

                  if (!body.Error) {

                    let rawData = body.raw_data;
                    let rawDataHex = body.raw_data_hex;

                    let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': ownerPrivateKey }

                    await Request({

                      url: contractURL + "/gettransactionsign",
                      method: "POST",
                      json: true,
                      body: signTransParams

                    }, async function (signError, signResponse, signBody) {
                      console.log(signBody, "signBody");
                      if (!signBody.Error) {

                        await Request({

                          url: contractURL + "/broadcasttransaction",
                          method: "POST",
                          json: true,
                          body: signBody

                        }, async function (broadCastError, broadCastResponse, broadCastBody) {

                          console.log(broadCastBody, "broadCastBody");

                          if (!broadCastBody.Error) {

                            if (broadCastBody.result) {

                              let transhash = broadCastBody.txid;

                              var update = await stripeTbl.updateOne({ _id: created._id }, { $set: { approvehash: transhash } });

                              if (update.modifiedCount) {
                                var data = {
                                  id: created._id,
                                  type: "coinTransfer"
                                }
                                Helper.getAPI("txfordeposit", data, function (ethApicontract) {

                                  if (ethApicontract.status) {
                                    return res.json({
                                      status: true,
                                      response: ethApicontract,
                                      details: created,
                                      message: ' Deposit Approved successfully.'
                                    });

                                  } else {

                                  }
                                })


                              } else {

                                return res.json({ status: false, message: 'Deposit approved has been failed.' });
                              }

                            } else {

                              return res.json({ status: false, message: 'broadCast status failed' });
                            }

                          } else {

                            return res.json({ status: false, message: 'Transaction broadCast failed' });
                          }
                        })

                      } else {

                        return res.json({ status: false, message: 'Transaction sign failed' });
                      }
                    })

                  } else {

                    return res.json({ status: false, message: body.Error });
                  }

                } else {

                  return res.json({ status: false, message: 'Please try again later' });
                }
              });

          } else {
            var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
            console.log(validUser, "validUser");
            //Currency other than ChinTwo
            console.log(buyCurrency, "buyCurrency");
            cointoken.findOne({ name: buyCurrency }, (err, isCoinExists) => {
              console.log(isCoinExists, "isCoinExists");
              console.log(err, "err");
              let TokenData = { ...isCoinExists }._doc;
              if (!err && isCoinExists) {
                var tokenAddress = TokenData.hexAddress;
                var tokenDecimal = TokenData.decimals
                let requestParams = { value: tokenAddress };
                console.log(requestParams, "requestParams");

                Request({

                  url: contractURL + "/getcontract",
                  method: "POST",
                  json: true,
                  body: requestParams


                }, async function (error, response, body) {
                  console.log(body, "bodyB");
                  console.log(error, "errorerror");

                  var amount = amountConvert(depositAmt, 6, "towei")
                  // var amount= depositAmt*1000000
                  var toaddress = validUser.hexAddress;
                  console.log(amount, toaddress);
                  var isvalidAdd = await blockWeb.isAddress(toaddress)
                  console.log(isvalidAdd, "isvalidAdd");
                  console.log(tokenAddress, "tokenAddress");
                  if (isvalidAdd == true) {

                    let instance = await blockWeb.contract().at(tokenAddress);
                    // console.log(instance,"----------------------instance");										
                    var resp = await instance["mint"](
                      toaddress,
                      amount.toString()
                    ).send();
                    console.log(resp, "resp");

                    var update = await stripeTbl.updateOne({ _id: created._id }, { $set: { approvehash: resp } });

                    if (update) {

                      var MintedCoins = isCoinExists.totalSupply + (+depositAmt)
                      console.log(isCoinExists.totalSupply, "isCoinExists.totalSupply")
                      console.log(depositAmt, "depositAmt")
                      console.log(MintedCoins, "MintedCoins")
                      var update2 = await cointoken.updateOne({ name: buyCurrency }, { $set: { 'totalSupply': +MintedCoins.toFixed(5) } })
                      console.log(MintedCoins.toFixed(5), "------------------>tofixed");
                      console.log(update, "update");

                      var data = {
                        id: created._id,
                        type: "tokenTransfer"
                      }


                      Helper.getAPI("txfordeposit", data, function (ethApicontract) {

                        if (ethApicontract.status) {
                          return res.json({
                            status: true,
                            response: ethApicontract,
                            details: created,
                            message: ' Deposit Completed Successfully.'
                          });

                        } else {
                          console.log("err while update");
                        }
                      })

                      // res.json({status : true,message:"deposit done",resdata:update});							


                    }





                  } else {
                    res.json({ status: false, message: "NOT VALID ADDRESS" });


                  }


                })

              } else {

                res.json({ status: false, message: err });
                console.log("Token Doesn't Exists.");
              }

            })


          }









        } else {
          console.log("Error occured during the payment process", err)
        }




      } else {
        console.log(err, "err");
      }

    });




  } catch (err) {
    // res.json(err)
    console.log(err, "error")
  }


}

// Stripe History
const stripeHistory = async (req, res) => {
  try {
    let reqData = req.body;
    let filter = (reqData.filtered) ? reqData.filtered : '';
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };

    await stripeTbl.find({}, {}, (err, history) => {
      if (!err && history) {
        console.log(history, "history");
        res.json({ status: true, data: history });
      } else {
        console.log(err, "err");
      }
    }).skip(skip).limit(limit).sort(sort).exec();


  } catch (err) {
    // res.json(err)
    console.log(err, "error")
  }
}




const amountConvert = (amount, decimal, type = "towei") => {
  if (type == "towei") {
    let coinwei = Math.pow(10, decimal);
    let sendAmount = amount * coinwei;
    return sendAmount = getNumber(sendAmount);
  } else if (type == "fromwei") {
    let coinwei = Math.pow(10, decimal);
    let sendAmount = amount / coinwei;
    return sendAmount = getNumber(sendAmount);
  }
}

const getNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += (new Array(e + 1)).join('0');
    }
  }
  if (!(Number.isInteger(x))) {
    x = parseInt(x.toString());
  }

  return x.toString();
}




module.exports = { DepositTransaction, getFiatDepositList, StripeDeposit, stripeHistory };
