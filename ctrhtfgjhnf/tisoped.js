const express = require('express');
const mongoose = require('mongoose');
const async = require('async');
const mailfn = require('../hprftghftgj/laimsd');
const common = require('../hprftghftgj/nommoc.js');
const power = require('../mdlhysreyh/voeligiblete')
const s3bucket = require('../hprftghftgj/tekcub3s.js');
const Request = require('request');
const hex2ascii = require('hex2ascii')
const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const currencyTbl = require('../mdlhysreyh/cixdnxr');
const buyCurrencyTbl = require('../mdlhysreyh/bunotsp');
const CoinCurrencyTbl = require('../mdlhysreyh/cionsdf');
const depositTbl = require('../mdlhysreyh/dylyonj');
const transactionTbl = require('../mdlhysreyh/tsiLnoitcasnart');
const adminBankTbl = require('../mdlhysreyh/adxnygj');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
const Helper = require('../hprftghftgj/nommoc');
const contractURL = Helper.contractAddress();
const tokensTbl = require('../mdlhysreyh/tsiLnekotTlla');
const stakingTbl = require('../mdlhysreyh/ekastsnekot');
const supplyTbl = require('../mdlhysreyh/ttlsply');
const CountryDB = require('../mdlhysreyh/cntrysc')
var geoip = require('geoip-lite');


exports.getCurrencyList = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;

    var isExist = await usersTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), ac_status: 1 }).countDocuments();

    if (isExist > 0) {

      async.parallel({

        paymentCurrency: function (cb) {

          currencyTbl.find({}, { _id: 0 }).exec(cb);
        },

        buyCurrency: function (cb) {

          buyCurrencyTbl.find({}, { _id: 0 }).exec(cb);
        },

      }, function (err, results) {

        var paymentCurrency = (results.paymentCurrency.length > 0) ? results.paymentCurrency : [];
        var buyCurrency = (results.buyCurrency.length > 0) ? results.buyCurrency : [];


        return res.json({
          status: true, paymentCurrency: paymentCurrency, buyCurrency: buyCurrency
        })
      })

    } else {

      res.json({ status: false, msg: 'Invalid user.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }

}

exports.submitCryptoDeposit = async (req, res) => {

  try {

    let reqParam = req.body;
    console.log("-------------------> ~ reqParam", reqParam)

    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    var isExist = await usersTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), ac_status: 1 }).countDocuments();
    var isKycExist = await usersTbl.findOne({ user_id: mongoose.mongo.ObjectId(req.userId) })



    if (isExist > 0) {
      if (isKycExist.kyc_status == 1) {
        var isTransExist = await depositTbl.find({ transhash: reqData.transhash }).countDocuments();

        if (isTransExist == 0) {

          let object = {
            'user_id': req.userId,
            'amount': reqData.amount,
            "paymentAmount": reqData.paymentAmount,
            'transhash': reqData.transhash,
            'buyCurrency': reqData.buyCurrency,
            'paymentCurrency': reqData.paymentCurrency,
            'walletAddress': reqData.walletAddress,
            'depositType': 0,
            'status': 0
          }

          depositTbl.create(object, async function (err, resData) {
            console.log("-------------------> ~ err", err)
            console.log("-------------------> ~ resData", resData)

            if (!err) {

              res.json({ status: true, msg: 'Your deposit request has been submitted successfully.' });

            } else {

              res.json({ status: false, msg: err });
            }

          })

        } else {

          return res.json({ status: false, msg: 'Transaction Id already exist.' })
        }


      } else {
        res.json({ status: false, msg: 'Complete your KYC to make this transaction' });

      }
    } else {

      res.json({ status: false, msg: 'Invalid user.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }
}

exports.getCryptoDepositHistory = (req, res) => {

  try {

    let reqParam = req.body;
    console.log("-------------------> ~ reqParam", reqParam)
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    let filter = (reqData.filtered) ? reqData.filtered : '';
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };

    var where = { depositType: 0, user_id: req.userId };

    console.log("-------------------> ~ where", where)
    async.parallel({

      depositData: function (cb) {

        depositTbl.find(where, { _id: 0, user_id: 0 }).skip(skip).limit(limit).sort(sort).exec(cb);
      },

      totalRecords: function (cb) {

        depositTbl.find(where).countDocuments().exec(cb);
      }

    }, function (err, results) {
      console.log("-------------------> ~ err", err)
      console.log("-------------------> ~ results", results)

      var data = (results.totalRecords > 0) ? results.depositData : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;

      return res.json({ status: true, data: data, count: count })

    })

  } catch (e) {
    return res.json({ status: false, msg: 'Something went wrong' });
  }
}

exports.submitFiatDeposit = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    var isExist = await usersTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), ac_status: 1 }).countDocuments();

    if (isExist > 0) {

      let object = {
        'user_id': req.userId,
        'amount': +reqData.amount,
        'transhash': reqData.transhash,
        'buyCurrency': reqData.buyCurrency,
        'paymentCurrency': reqData.paymentCurrency,
        'walletAddress': reqData.walletAddress,
        'paymentType': +reqData.paymentType,
        'status': 0,
        'depositType': 2
      }

      depositTbl.create(object, async function (err, resData) {

        if (!err) {

          res.json({ status: true, msg: 'Your deposit request has been submitted successfully.' });

        } else {

          res.json({ status: false, msg: err });
        }

      })

    } else {

      res.json({ status: false, msg: 'Invalid user.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }
}

exports.getFiatDepositHistory = (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    let filter = (reqData.filtered) ? reqData.filtered : '';
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };

    var where = { depositType: 1, user_id: req.userId };

    async.parallel({

      depositData: function (cb) {

        depositTbl.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
      },

      totalRecords: function (cb) {

        depositTbl.find(where).countDocuments().exec(cb);
      }

    }, function (err, results) {



      var data = (results.totalRecords > 0) ? results.depositData : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;

      return res.json({ status: true, data: data, count: count })

    })

  } catch (e) {

    return res.json({ status: false, msg: 'Something went wrong' });
  }
}

exports.getAdminBankDetails = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;
    let reqData = reqParam.payload;

    if (reqType == 'ADMIN_BANK_DETAILS') {

      let gets = { _id: 0 };

      var isExist = await adminBankTbl.find({ 'status': 1 }, gets);

      if (isExist.length > 0) {

        let bankData = isExist[0];

        res.json({ status: true, data: bankData });

      } else {

        res.json({ status: false, msg: 'Invalid user details' });
      }

    } else {

      res.json({ status: false, msg: 'Access denied.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }
}


exports.transactionList_search = async (req, res) => {
  try {

    let reqData = req.body;
    let filter = (reqData.filtered) ? reqData.filtered : '';
    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };
    const search = reqData.search


    if (search.length > 55) {
      transactionTbl.find({ "approvehash": search }, async (err, approveHashData) => {
        if (approveHashData != null || approveHashData.length != 0) {
          res.json({ Type: "ApproveHash", data: approveHashData })
        }
        else {
          res.json({ Type: "ApproveHash", data: [] })
        }
      })

    } else if (search.length > 6 && search.length < 15) {
      transactionTbl.find({ "blockNumber": search }, async (err, blockNumberData) => {
        if (blockNumberData != null || blockNumberData.length != 0) {
          res.json({ Type: "Block", data: blockNumberData })
        }
        else {
          res.json({ Type: "Block", data: [] })
        }
      })
    } else

      transactionTbl.find({ $or: [{ "owner_address": search }, { "to_address": search }] }, (err, walletAddressData) => {
        if (walletAddressData == null || walletAddressData.length == 0) {

          usersTbl.findOne({ "hexAddress": search }, async (err, userData) => {
            if (userData != null) {


              let requestParams = { address: search };
              Request({
                url: contractURL + "/getaccount",
                method: "POST",
                json: true,
                body: requestParams
              }, async function (error, response, body) {
                var bodyBalance = +(body.balance / Math.pow(10, 6)).toString();

                let walletInfo = {
                  Chin_balance: bodyBalance,
                  TotalTrnxs: [],
                  user: userData
                }
                res.json({
                  Type: "WalletAddress", data: walletInfo,

                })
              })
            } else {

              res.json({ status: false, message: "Not a user" })

            }
          })


        }
        else {

          usersTbl.findOne({ "hexAddress": search }, async (err, userData) => {
            if (userData != null) {
              var count = await transactionTbl.find({}).countDocuments();

              let requestParams = { address: search };
              Request({
                url: contractURL + "/getaccount",
                method: "POST",
                json: true,
                body: requestParams
              }, async function (error, response, body) {
                var bodyBalance = +(body.balance / Math.pow(10, 6)).toString();
                let walletInfo = {
                  Chin_balance: bodyBalance,
                  TotalTrnxs: walletAddressData,
                  user: userData
                }
                res.json({
                  Type: "WalletAddress", data: walletInfo,
                  Count: count
                })
              })
            } else {


              res.json({ status: false, data: {} })

            }
          })

        }
      }).skip(skip).limit(limit).sort(sort).exec();






  } catch (err) {

    res.json({
      status: 412,
      message: "Unable to save"
    });
    res.end();
  }
}



exports.transactionHash = async (req, res) => {
  try {


    let requestParams = { value: "5c18f871078771640986df57db70554cac34ae65812c9aff4e933dcafa952b8a" };



    await Request({

      url: contractURL + "/gettransactionbyid",
      method: "POST",
      json: true,
      body: requestParams

    }, async function (error, response, body) {

    })

  } catch (err) {

    res.json({
      status: 412,
      message: "Unable to save"
    });
    res.end();
  }
}

exports.explorerData = async (req, res) => {
  try {
    async.parallel({

      TotalTXNS: function (cb) {

        transactionTbl.find({}).countDocuments().exec(cb);

      },

      TotalAccounts: function (cb) {

        usersTbl.find({}).countDocuments().exec(cb);

      },
      TotalSupply: function (cb) {

        supplyTbl.find({}).exec(cb);

      },


      blockHis: function (cb) {
        transactionTbl.aggregate([
          { $project: { 'blockNumber': 1, 'updated_at': 1 } },
          { $group: { '_id': '$blockNumber', updated_at: { $first: "$updated_at" }, block_number: { $first: "$blockNumber" } } },
          // { $skip : 10 },
          { $sort: { 'updated_at': -1 } },
          { $limit: 5 },
        ]).allowDiskUse(true).exec(cb)

      },
      CurrentMaxTPS: function (cb) {

        usersTbl.find({}).countDocuments().exec(cb);


      },

      TotalChinFrozen: function (cb) {


        stakingTbl.aggregate([{
          $group: {
            _id: null,
            "TotalAmount": {
              $sum: "$amount"
            }
          }
        }]).exec(cb);



      }
    }, function (err, results) {
      Request({
        url: contractURL + "/getnowblock",
        method: "POST",
        json: true,
      }, async function (error, response, body) {
        var blockNumber1 = body.block_header.raw_data.number;

        var blockNumber2 = {}
        var blockNumber3 = {}

        Request({
          url: contractURL + "/getnodeinfo",
          method: "GET",
          json: true,
        }, async function (error, response, body) {
          console.log(body, "----------body")
          // console.log(body.nodes.length,"----------body   fhfgh")

          if (Object.keys(body).length === 0) {
            blockNumber2 = 0
          } else {
            blockNumber2 = body.currentConnectCount;
          }
          console.log(results.TotalChinFrozen, " results.TotalChinFrozen");
          if (results.TotalChinFrozen.length > 0) {
            blockNumber3 = results.TotalChinFrozen[0].TotalAmount
          } else {
            blockNumber3 = 0
          }

          // divAmount=amountConvert(frozwen,6,"fromwei")

          var data = {
            "LatestBlockNumber": blockNumber1,
            "TotalAccounts": results.TotalAccounts,
            "TotalTXNS": results.TotalTXNS,
            "Current/MaxTPS": results.CurrentMaxTPS,
            "TotalNodes": blockNumber2,
            "TotalTRXFrozen": blockNumber3,
            "Total_Supply": results.TotalSupply,
            "blockNumber": results.blockHis
          }

          return res.json({ status: true, data: data })
        })
      })
    })

  } catch (err) {

    res.json({
      status: false,
      message: "something went wrong!"
    });
    res.end();
  }
}


exports.pievalue = (req, res) => {
  try {

    buyCurrencyTbl.find({ "type": "adminToken" }, { "name": 1, "symbol": 1, "convert": 1, "totalSupply": 1, "name": 1, "burnedCoins": 1 }, (err, data) => {
      if (data) {
        res.json({ 'status': true, 'data': data })
      }
      else {
        res.json({ 'status': false, 'message': 'No data found' })
      }

    });

  }
  catch (e) {

  }
}

exports.StableCoinData = async (req, res) => {
  try {

    var StableCoinsList = await buyCurrencyTbl.find({}).sort({ "created_at": -1 });


    let reqData = req.body;


    let pageNo = (reqData.page) ? reqData.page : '0';
    let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { created_at: -1 };

    var where = {};

    async.parallel({

      StableCoinsList11: function (cb) {

        buyCurrencyTbl.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
      },

      totalRecords: function (cb) {

        buyCurrencyTbl.find(where).countDocuments().exec(cb);
      }

    }, function (err, results) {

      var data = (results.totalRecords > 0) ? results.StableCoinsList11 : [];
      var count = (results.totalRecords) ? results.totalRecords : 0;
      res.json({ status: true, StableCoinsList: data, Count: count })

    })



  } catch (err) {
    console.log(err)
    res.json({
      status: false,
      message: "something went wrong!"
    });
    res.end();
  }
}


exports.StableCoinGraph = async (req, res) => {
  try {

    var data = await buyCurrencyTbl.find({})

    var arr = [];
    for (var i = 0; i < data.length; i++) {


      // console.log(data[i].name,"|data")
      var Where = { buyCurrency: data[i].name, status: 1 };
      depositTbl.aggregate([
        { $match: Where },
        { $project: { '_id': 0, 'Month': { $month: "$created_at" }, amount: '$amount' } },

        {
          $group: {
            '_id':
            {
              month:
                '$Month',
              currency: data[i].name
            },
            'amount': { $sum: { $toDouble: "$amount" } }
          }
        },
      ], async (err, data2) => {

        if (data2.length != 0) {
          arr.push(data2)
        }
        //   else{


        // console.log(data,"data")
        // console.log(data[i],"data[i]")
        // console.log(arr,"arr")
        // arr.push({ '_id':{ 'month':data[i].created_at, currency:data[i].name} , amount: 0 })

        //  }
      })

    }

    setTimeout(() => {
      // console.log(arr,"arr")
      res.json(arr)

    }, 2000)
  } catch (err) {

    res.json({
      status: false,
      message: "something went wrong!"
    });
    res.end();
  }

}

exports.VoteList = (req, res) => {
  try {
    let params = req.body;
    let pageNo = params.page ? params.page : "0";
    let pageSize = params.pageSize ? params.pageSize : "0";
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { modifiedDate: -1 };
    // console.log(req.body,"req bdy")
    var where = {};
    async.parallel({

      voterListData: function (cb) {

        power.aggregate([

          // { $match: where},
          {
            "$lookup": {
              "from": "CT_usvhyhj",
              "localField": "userId",
              "foreignField": "_id",
              "as": "userdata"
            }

          },

          {
            "$project": {

              "userId": 1,
              "total_power": 1,
              "user_name": { "$arrayElemAt": ["$userdata.user_name", 0] },
              "hexAddress": { "$arrayElemAt": ["$userdata.hexAddress", 0] },
              "country": { "$arrayElemAt": ["$userdata.country", 0] },
              "modifiedDate": 1,
              // "createdDate":1

            }
          },



          {
            "$sort": sort
          },
          {
            "$skip": skip
          },
          {
            "$limit": limit
          }

        ]).exec(cb);

      },

      totalRecords: function (cb) {

        power.find({}).countDocuments().exec(cb);
      },


    }, async function (err, results) {
      // console.log(results, "results")
      // console.log(results.voterListData.length, "results.voterListData.length;");
      console.log(err, "err")
      let arr = []
      for (let i = 0; i < results.voterListData.length; i++) {

        let countr = results.voterListData[i].country;
        // console.log(results.voterListData[i],"results.voterListData[i].country");
        var countryData = await CountryDB.findOne({ "name": countr })
        // console.log(countryData,"countryData")

        results.voterListData[i].coordinates = countryData.coordinates
        // arr.push(countryData);

      }

      return res.json({ status: true, data: results.voterListData, Count: results.totalRecords })

    })


  }
  catch (e) {

  }
}

// exports.worldMap = (req, res) => {
//   try {
//     let arr = [], resp = []; var blockNumber2 = {}
//     Request({

//       // url: "http://44.198.210.6:46667/wallet/listnodes",
//       url: contractURL + "/getnodeinfo",
//       method: "get",
//       json: true,
//     },
//       async function (infoerror, inforesponse, infobody) {


//         if (Object.keys(infobody).length === 0) {
//           blockNumber2 = 0;
//           var geo = geoip.lookup('98.6.210.6');
//           console.log(geo, "respppppppp");

//           // res.json({ "data": 0 })
//           let element2 = [
//             {
//               "range": [
//                 750780416,
//                 752877567
//               ],
//               "country": "US",
//               "region": "VA",
//               "eu": "0",
//               "timezone": "America/New_York",
//               "city": "Ashburn",
//               "ll": [
//                 39.0481,
//                 -77.4728
//               ],
//               "metro": 511,
//               "area": 1000,
//               "count": 3
//             },

//             {
//               range: [1644614144, 1644614151],
//               country: 'US',
//               region: 'TX',
//               eu: '0',
//               timezone: 'America/Chicago',
//               city: 'Dilley',
//               ll: [28.6782, -99.1747],
//               metro: 641,
//               area: 500,
//               "count": 1
//             }

//           ]

//           res.json({ "data": element2 })

//         } else {
//           blockNumber2 = infobody.nodes.length;

//           console.log(infobody, "infobody");

//           for (let i = 0; i < infobody.nodes.length; i++) {


//             var data = infobody.nodes[i].address.host
//             var data = infobody.nodes[i].address.host
//             console.log(data, "data");

//             var ip = hex2ascii(data);


//             // for(let i=0;i<ip.length;i++){
//             var geo = geoip.lookup(ip);
//             // console.log(geo,"respppppppp");

//             arr.push(geo)
//             // }


//             // if(i==infobody.nodes.length-1){

//             console.log(arr, "tyupo");
//             // }


//           }

//           setTimeout(() => {
//             var element = []
//             arr.forEach((obj, i) => {

//               const key = `${obj.country}${obj.ll}${obj.city}`;
//               if (!resp[key]) {
//                 resp[key] = { ...obj, count: 0 };
//                 element.push(resp[key])

//               }
//               resp[key].count += 1;
//             });


//             res.json({ "data": element })

//           }, 2000)
//         }
//       });
//   } catch (e) {
//     response = { status: false, Error: e };
//     console.log(e);
//   }


// }

exports.worldMap = (req, res) => {
  try {
    let arr = [], resp = []; var blockNumber2 = {}
    Request({

      url: "http://44.198.210.6:46667/wallet/getnodeinfo",
      method: "get",
      json: true,
    },
      async function (infoerror, inforesponse, infobody) {


        if (Object.keys(infobody).length === 0) {
          blockNumber2 = 0;
          res.json({ "data": 0 })

        } else {
          blockNumber2 = infobody.peerList;


          for (let i = 0; i < infobody.peerList.length; i++) {


            var data = infobody.peerList[i].host
            // console.log("-------------------> ~ data", data)




            var geo = geoip.lookup(data);
            console.log(geo, "respppppppp");

            arr.push(geo)
            // console.log("-------------------> ~ arr", arr)


          }
          setTimeout(() => {
            var element = []
            arr.forEach((obj, i) => {

              const key = `${obj.country}${obj.ll}${obj.city}`;
              if (!resp[key]) {
                resp[key] = { ...obj, count: 0 };
                element.push(resp[key])

              }
              resp[key].count += 1;
            });


            res.json({ "data": element })

          }, 2000)
        }
      });
  } catch (e) {
    response = { status: false, Error: e };
    console.log(e);
  }


}




exports.trnxListsExplorer = async (req, res) => {
  try {
    var sort = { created_at: -1 };
    var limit = 10;

    transactionTbl.find({}, (err, trnxListData) => {
      if (trnxListData != null || trnxListData.length != 0) {
        res.json({ status: true, message: "success", data: trnxListData })
      }
      else {
        res.json({ status: true, message: "success", data: [] })
      }
    }).sort(sort).limit(limit)
  } catch (err) {

    res.json({
      status: false,
      message: "something went wrong!"
    });
    res.end();
  }
}

// amount convert
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


