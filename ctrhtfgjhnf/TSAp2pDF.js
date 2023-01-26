const express = require("express");
const mongoose = require("mongoose");
const async = require("async");
const Request = require("request");
const common = require("../hprftghftgj/nommoc.js");
const s3bucket = require('../hprftghftgj/tekcub3s.js');
const p2porderDB = require("../mdlhysreyh/redorp2p");
const p2pmappingDB = require("../mdlhysreyh/gingppmreors");
const p2pnotiDB = require("../mdlhysreyh/ntiononaswr");
const userDB = require("../mdlhysreyh/usrscdsfgesdg");
const siteDB = require("../mdlhysreyh/sitstgsgfs");
const config = require("../nddetdthtfjh/config");
const socket_config = require("../hprftghftgj/tekcos");
var socketio = require('socket.io');
// let server;
// if (config.serverType == "http") {

//   const http = require("http");
//   server = http.createServer(app);
// }
// var io = socketio(server, {
//   cors: {
//     origin: '*',
//   },
//   serveClient: false,
//   pingTimeout: 6000000,
//   pingInterval: 30000,
//   cookie: false
// });
// socket_config.initiate(io);

//post advertisement
exports.postAdvertisement = async (req, res) => {

  try {
    let data = req.body;
    let userId = mongoose.Types.ObjectId(req.userId);

    if (!data.fromCurrency) {
      res.json({ status: false, msg: "first currency required!" })
    }
    if (!data.toCurrency) {
      res.json({ status: false, msg: "second currency required!" })
    }
    if (!data.price) {
      res.json({ status: false, msg: "price required!" })
    }

    if (data.orderType == "sell") {


      if (data.fromCurrency == "ChinTwo") {
        var data1 = {
          userId: userId,
          amount: data.amount,
          orderType: data.orderType,
          flag: false,
          type: "coin",
          toCurrency: data.toCurrency
        }
      }
      else {
        var data1 = {
          userId: userId,
          amount: data.amount,
          orderType: data.orderType,
          flag: false,
          type: "token",
          currencyName: data.fromCurrency,
          toCurrency: data.toCurrency

        }

      }


      common.getAPI("escrowDeposit", data1, function (response) {
        if (response.status == true) {
          if (data.fromCurrency == "ChinTwo") {
            var data2 = {
              userId: userId,
              type: "coinTransfer",
              orderType: data.orderType,
              approvehash: response.transhash,
              currencyName: data.fromCurrency,
              toCurrency: data.toCurrency,
              amount: data.amount,
            }
          } else {
            var data2 = {
              userId2: userId,
              type: "tokenTransfer",
              orderType: data.orderType,
              approvehash: response.approvehash,
              currencyName: data.fromCurrency,
              toCurrency: data.toCurrency,
              amount: data.amount,
            }
          }

          common.getAPI("txforp2p", data2, function (response) {
            if (response.status) {

            }
          })

          userDB.findOne({ "_id": userId }, (err, getuser) => {
            if (!err && getuser != null) {
              let orderData = {};
              orderData = {
                userId: userId,
                placerOwnAddress: getuser.placerOwnAddress,
                fromCurrency: data.fromCurrency,
                toCurrency: data.toCurrency,
                userWalletAddress: data.userWalletAddress,
                amount: data.amount,
                price: data.price,
                total: data.amount * data.price,
                orderType: "sell",
                approvehash: response.transhash
              };
              p2porderDB.create(orderData, (err, created) => {
                if (!err && created) {
                  res.json({
                    status: true,
                    msg: "Advertisement Posted successfully",
                  });
                } else {
                  res.json({
                    status: false,
                    msg: "Error occurred in order creation. Please try again later",
                  });
                }
              });
            } else {
              res.json({ status: false, msg: "Unauthorized person" });
            }
          });
        } else {
          res.json({
            status: false,
            msg: response.message,
          });
        }


      })


    }
    else {

      userDB.findOne({ "_id": userId }, (err, getuser) => {
        if (!err && getuser != null) {
          let orderData = {};
          orderData = {
            userId: userId,
            placerOwnAddress: getuser.placerOwnAddress,
            fromCurrency: data.fromCurrency,
            toCurrency: data.toCurrency,
            userWalletAddress: data.userWalletAddress,
            amount: data.amount,
            price: data.price,
            total: data.amount * data.price,
            orderType: "buy",
          };

          p2porderDB.create(orderData, (err, created) => {
            if (!err && created) {
              res.json({
                status: true,
                msg: "Advertisement Posted successfully",
              });
            } else {
              res.json({
                status: false,
                msg: "Error occurred in order creation. Please try again later",
              });
            }
          });
        } else {
          res.json({ status: false, msg: "Unauthorized person" });
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

//get orders
exports.getOrders = async (req, res) => {
  try {
    let params = req.body;
    let pageNo = params.page ? params.page : "0";
    let pageSize = params.pageSize ? params.pageSize : "0";
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { dateTime: -1 };
    let data = req.body; //orderType
    if (data.orderType != undefined && typeof data.orderType != "undefined") {
      if (data.orderType == "buy" || data.orderType == "sell") {
        p2porderDB.aggregate(
          [
            {
              $lookup: {
                from: "CT_usvhyhj",
                localField: "userId",
                foreignField: "_id",
                as: "userdata",
              },
            },
            {
              $project: {
                userId: 1,
                placerOwnAddress: 1,
                orderType: 1,
                fromCurrency: 1,
                toCurrency: 1,
                price: 1,
                amount: 1,
                total: 1,
                isKycNeed: 1,
                dateTime: 1,
                user: { $arrayElemAt: ["$userdata._id", 0] },
                protectKey: { $arrayElemAt: ["$userdata.protect_key", 0] },
                unusualKey: { $arrayElemAt: ["$userdata.unusual_key", 0] },
                username: { $arrayElemAt: ["$userdata.user_name", 0] },
                status: {
                  $cond: {
                    if: { $eq: ["$status", 0] },
                    then: "Pending",
                    else: {
                      $cond: {
                        if: { $eq: ["$status", 2] },
                        then: "Progress",
                        else: {
                          $cond: {
                            if: { $eq: ["$status", 3] },
                            then: "Cancelled",
                            else: "Completed",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              $match: {
                orderType: data.orderType,
                status: "Pending",
                availableAmount: { $ne: 0 },
              },
            },
            {
              "$sort": sort
            },
            {
              "$skip": skip,
            },
            {
              "$limit": limit,
            },
          ],
          async (err, result) => {
            if (!err && result.length > 0) {
              var listCount = await p2porderDB.find({}).countDocuments();
              let count = 0;
              for (let i = 0; i < result.length; i++) {
                protect_key = common.decrypt(result[i].protectKey);
                unusual_key = common.decrypt(result[i].unusualKey);
                result[i].email = protect_key + unusual_key;
                count++;

                if (count == result.length) {

                  res.json({
                    status: true,
                    data: result,
                    count: listCount,
                  });
                }
              }
            } else {
              res.json({ status: true, data: [] });
            }
          }).exec();
      }
    }
  } catch (err) {
    res.json({
      status: false,
      msg: "Oops! Something went wrong. Please try again later",
    });
  }
};

//mapping code
exports.orderCreate = async (req, res) => {
  try {

    let data = req.body; //_id, amount, orderType
    let userId = mongoose.Types.ObjectId(req.userId);
    userDB.findOne({ _id: userId }, (err, getuser) => {
      if (!err && getuser != null) {
        if (
          data._id != undefined &&
          typeof data._id != "undefined" &&
          data.amount != undefined &&
          typeof data.amount != "undefined" &&
          data.orderType != undefined &&
          typeof data.orderType != "undefined"
        ) {
          p2porderDB.findOne(
            { _id: mongoose.Types.ObjectId(data._id) },
            (err, getorder) => {
              if (!err && getorder != null) {
                if (getorder.status == 0) {
                  if (getorder.availableAmount != 0) {
                    if (getorder.userId.toString() != userId.toString()) {
                      let kycverified;
                      if (getorder.isKycNeed == true) {
                        if (getuser.kycVerified == true) {
                          kycverified = true;
                        } else {
                          kycverified = false;
                        }
                      } else {
                        kycverified = true;
                      }
                      if (kycverified) {
                        if (data.amount == getorder.amount) {
                          let obj = {};
                          if (data.orderType == "buy") {
                            obj = {
                              buyUserId: getorder.userId,
                              sellUserId: userId,
                              orderId: getorder._id,
                              amount: data.amount,
                              price: getorder.price,
                              total: data.amount * getorder.price,
                              orderType: "buy",
                              fromCurrency: getorder.fromCurrency,
                              toCurrency: getorder.toCurrency
                            };
                          } else {
                            obj = {
                              sellUserId: getorder.userId,
                              buyUserId: userId,
                              orderId: getorder._id,
                              amount: data.amount,
                              price: getorder.price,
                              total: data.amount * getorder.price,
                              orderType: "sell",
                              fromCurrency: getorder.fromCurrency,
                              toCurrency: getorder.toCurrency
                            };
                          }


                          if (data.orderType == "buy") {

                            var senderId = userId;
                            var sendAmount = parseFloat(getorder.price);
                            var data1;


                            if (getorder.toCurrency == "ChinTwo") {
                              data1 = {
                                userId: senderId,
                                amount: sendAmount.toFixed(4),
                                flag: false,
                                type: "coin",
                                orderType: data.orderType,
                              }
                            }
                            else {
                              data1 = {
                                userId: senderId,
                                amount: sendAmount.toFixed(4),
                                flag: false,
                                type: "token",
                                currencyName: getorder.toCurrency,
                                fromCurrency: getorder.fromCurrency
                              }

                            }




                            common.getAPI("escrowDeposit", data1, function (response) {
                              if (response.status == true) {
                                if (getorder.toCurrency == "ChinTwo") {
                                  var data2 = {
                                    userId: userId,
                                    type: "coinTransfer",
                                    orderType: data.orderType,
                                    approvehash: response.transhash,
                                    currencyName: getorder.toCurrency,
                                    toCurrency: getorder.fromCurrency,
                                    amount: data.amount,
                                  }
                                } else {
                                  var data2 = {
                                    userId2: userId,
                                    type: "tokenTransfer",
                                    orderType: data.orderType,
                                    approvehash: response.approvehash,
                                    currencyName: getorder.toCurrency,
                                    toCurrency: getorder.fromCurrency,
                                    amount: data.amount,
                                  }
                                }
                                common.getAPI("txforp2p", data2, function (response) {
                                  if (response.status) {
                                    console.log("done")

                                  }
                                })



                                p2pmappingDB.create(obj, (err, mapcreated) => {
                                  if (!err && mapcreated) {
                                    p2porderDB.updateOne(
                                      { _id: mongoose.Types.ObjectId(getorder._id) },
                                      { $set: { status: 2 } },
                                      (err, updated) => {
                                        if (!err && updated) {
                                          orderEmit(mapcreated._id);
                                          let buynotify = {
                                            userId: obj.buyUserId,
                                            message:
                                              "Order matched successfully. Waiting for your payment and confirmation",
                                            referenceId: mapcreated._id,
                                            keyValue: "p2p",
                                          };
                                          p2pnotiDB.create(
                                            buynotify,
                                            (err, buynoti) => {
                                              socket_config.sendmessage(
                                                "getNotify",
                                                buynoti
                                              );
                                              let sellnotify = {
                                                userId: obj.sellUserId,
                                                message:
                                                  "Order matched successfully. Waiting for buyer confirmation",
                                                referenceId: mapcreated._id,
                                                keyValue: "p2p",
                                              };
                                              p2pnotiDB.create(
                                                sellnotify,
                                                (err, sellnoti) => {
                                                  socket_config.sendmessage(
                                                    "getNotify",
                                                    sellnoti
                                                  );
                                                  res.json({
                                                    status: true,
                                                    message:
                                                      "Order matched successfully",
                                                    data: mapcreated,
                                                  });
                                                }
                                              );
                                            }
                                          );
                                        } else {
                                          res.json({
                                            status: false,
                                            message:
                                              "Error in mapping. Please try again later",
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    res.json({
                                      status: false,
                                      message:
                                        "Error occurred in mapping. Please try again later",
                                    });
                                  }
                                });

                              } else {
                                res.json({
                                  status: false,
                                  msg: response.message,
                                });
                              }
                            })

                          } else {
                            p2pmappingDB.create(obj, (err, mapcreated) => {
                              if (!err && mapcreated) {
                                p2porderDB.updateOne(
                                  { _id: mongoose.Types.ObjectId(getorder._id) },
                                  { $set: { status: 2 } },
                                  (err, updated) => {
                                    if (!err && updated) {
                                      orderEmit(mapcreated._id);
                                      let buynotify = {
                                        userId: obj.buyUserId,
                                        message:
                                          "Order matched successfully. Waiting for your payment and confirmation",
                                        referenceId: mapcreated._id,
                                        keyValue: "p2p",
                                      };
                                      p2pnotiDB.create(
                                        buynotify,
                                        (err, buynoti) => {
                                          socket_config.sendmessage(
                                            "getNotify",
                                            buynoti
                                          );
                                          let sellnotify = {
                                            userId: obj.sellUserId,
                                            message:
                                              "Order matched successfully. Waiting for buyer confirmation",
                                            referenceId: mapcreated._id,
                                            keyValue: "p2p",
                                          };
                                          p2pnotiDB.create(
                                            sellnotify,
                                            (err, sellnoti) => {
                                              socket_config.sendmessage(
                                                "getNotify",
                                                sellnoti
                                              );
                                              res.json({
                                                status: true,
                                                message:
                                                  "Order matched successfully",
                                                data: mapcreated,
                                              });
                                            }
                                          );
                                        }
                                      );
                                    } else {
                                      res.json({
                                        status: false,
                                        message:
                                          "Error in mapping. Please try again later",
                                      });
                                    }
                                  }
                                );
                              } else {
                                res.json({
                                  status: false,
                                  message:
                                    "Error occurred in mapping. Please try again later",
                                });
                              }
                            });

                          }

                        } else {
                          res.json({
                            status: false,
                            message: `Amount should be equal to ${getorder.amount}`,
                          });
                        }
                      } else {
                        res.json({
                          status: false,
                          message: "Kyc verification is must to place the order",
                        });
                      }
                    } else {
                      res.json({ "status": false, "message": "You cannot buy or sell with your own order" })
                    }
                  } else {
                    res.json({
                      status: false,
                      message: "This order has been completed already",
                    });
                  }
                } else {
                  res.json({
                    status: false,
                    message: "This order has been completed already",
                  });
                }
              } else {
                res.json({ status: false, message: "Invalid Id" });
              }
            }
          );
        } else {
          if (data._id == undefined) {
            res.json({ status: false, message: "Id is required" });
          } else if (data.amount == undefined) {
            res.json({ status: false, message: "Amount is required" });
          } else {
            res.json({ status: false, message: "Ordertype is required" });
          }
        }
      } else {
        res.json({ status: false, message: "Unauthorized person" });
      }
    });
  } catch (err) {

    res.json({
      status: false,
      message: "Oops! Something went wrong. Please try again later",
    });
  }
};

let orderEmit = exports.orderEmit = (Id) => {
  socket_config.sendmessage('emitMapping', { "_id": Id })
}

//chat add
exports.chat = async (req, res) => {
  try {
    let data = req.body;//_id, message
    var userID = mongoose.Types.ObjectId(req.userId);
    if (data._id != undefined && typeof data._id != 'undefined' && data.message != undefined && typeof data.message != 'undefined') {
      userDB.findOne({ "_id": mongoose.Types.ObjectId(req.userId) }, (err, getuser) => {
        if (!err && getuser != null) {
          data.datetime = new Date();
          data.userId = req.userId;
          data.walletAddress = getuser.hexAddress;
          p2porderDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getorderdata) => {
            // console.log("-------------------> ~ getorderdata", getorderdata)
            if (!err && getorderdata != null) {
              p2pmappingDB.findOne({ "orderId": mongoose.Types.ObjectId(getorderdata._id) }, (err, getmapdata) => {

                if (!err && getmapdata != null) {
                  if (getmapdata.buyUserId.toString() == userID.toString()
                    || getmapdata.sellUserId.toString() == userID.toString()) {

                    // console.log(getmapdata.buyUserId.toString() == userID.toString(), "match")
                    // console.log(getmapdata.sellUserId.toString() == userID.toString(), "match2")


                    p2pmappingDB.updateOne({ "orderId": mongoose.Types.ObjectId(getorderdata._id) }, { "$push": { "chats": data } }, (err, chatupdate) => {
                      if (!err && chatupdate) {

                        p2pmappingDB.findOne({ "orderId": mongoose.Types.ObjectId(getorderdata._id) }, async (err, chatdata) => {
                          if (!err && chatdata) {
                            // console.log("-------------------> ~ chatdata", chatdata)
                            // chatsSoc = chatdata.chats
                            // i = (chatsSoc.length) - 1;




                            socket_config.onnn("chatroom")








                            // console.log("checking22222--------------", orderId)
                            // var matchId = await common.generateroomid(orderId);
                            // console.log("-------------------> ~ matchId", matchId)
                            // await socket_config.join(matchId);

                            // await io.to(matchId).sendmessage('chatList', chatdata.chats)

                            // socket_config.sendmessage('chatList', chatdata.chats[i]);
                            res.json({ "status": true });

                          }

                        })
                      } else {
                        res.json({ "status": false, "message": "Error occurred in p2p chat data. Please try again later" })
                      }
                    })
                  } else {
                    res.json({ "status": false, "message": "Invalid Access" })

                  }
                } else {
                  res.json({ "status": false, "message": "Invalid Id" })
                }
              })
            }
          })
        } else {
          res.json({ "status": false, "message": "User Does not exist" })
        }
      })
    } else {
      if (data.message == undefined) {
        res.json({ "status": false, "message": "Message is required" })
      } else {
        res.json({ "status": false, "message": "Id is required" })
      }
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//get chat
exports.getChat = async (req, res) => {
  try {
    let data = req.body;//_id
    console.log("-------------------> ~ data", data)
    if (data._id != undefined && typeof data._id != 'undefined') {
      p2porderDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getorderdata) => {
        if (!err && getorderdata != null) {
          console.log("-------------------> ~ getorderdata", getorderdata)
          p2pmappingDB.findOne({ "orderId": mongoose.Types.ObjectId(getorderdata._id) }, (err, getmapdata) => {
            if (!err && getmapdata != null) {
              console.log("-------------------> ~ getmapdata", getmapdata)

              // console.log(data)
              // data.unshift(message)
              res.json({ "status": true, "data": getmapdata.chats })

              // chatsSoc = getmapdata.chats
              // i = (chatsSoc.length) - 1;

              // socket_config.sendmessage('personalChat', chatdata.chats[i]);

            } else {
              res.json({ "status": true, "data": [] })
            }
          })
        }
      })
    } else {
      res.json({ "status": false, "message": "Id is required" })
    }
  } catch (err) {
    console.log("-------------------> ~ err", err)

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//get chat with url
exports.getSwapChat = async (req, res) => {
  try {
    let data = req.params;//_id
    if (data._id != undefined && typeof data._id != 'undefined') {
      p2porderDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getorderdata) => {
        if (!err && getorderdata != null) {
          p2pmappingDB.findOne({ "orderId": mongoose.Types.ObjectId(getorderdata._id) }, (err, getmapdata) => {
            if (!err && getmapdata != null) {
              res.json({ "status": true, "data": getmapdata.chats })
            } else {
              res.json({ "status": true, "data": [] })
            }
          })
        }
      })
    } else {
      res.json({ "status": false, "message": "Id is required" })
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//buyer confirmation
exports.buyerConfirmation = async (req, res) => {
  try {
    let data = req.body;
    if (data._id != undefined && typeof data._id != 'undefined') {
      p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getorder) => {
        if (!err && getorder != null) {
          if (getorder.buyerConfirmation == false) {
            p2pmappingDB.updateOne({ "_id": mongoose.Types.ObjectId(data._id) }, { "$set": { "buyerConfirmation": true, "buyerDatetime": new Date() } }, (err, buyupdate) => {
              if (!err && buyupdate) {
                p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, mapdata) => {
                  p2porderDB.updateOne({ "_id": mapdata.orderId }, { $set: { "status": 5 } }, (err, updatedata) => {
                    console.log(err, "err")
                    socket_config.sendmessage("mapDetails", mapdata);
                    res.json({ "status": true, "message": "Buyer confirmed successfully" })
                  })
                })
              } else {
                res.json({ "status": false, "message": "Error occurred in buyer confirmation. Please try again later" })
              }
            })
          } else {
            res.json({ "status": true, "message": "already confirmed" })
          }
        } else {
          res.json({ "status": false, "message": "Invalid Id" })
        }
      })
    } else {
      res.json({ "status": false, "message": "Id is required" })
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//seller confirmation
exports.sellerConfirmation = async (req, res) => {
  try {
    let data = req.body;

    p2pmappingDB.aggregate([
      {
        "$lookup": {
          "from": "CT_PPordRkFRLUxpcQ",
          "localField": "orderId",
          "foreignField": "_id",
          "as": "orderdata"
        }
      },
      {
        "$project": {
          "buyUserId": 1,
          "sellUserId": 1,
          "orderId": 1,
          "amount": 1,
          "price": 1,
          "total": 1,
          "orderType": 1,
          "sellerConfirmation": 1,
          "buyerConfirmation": 1,
          "buyerDatetime": 1,
          "sellerDatetime": 1,
          "datetime": 1,
          "_id": 1,
          "fromCurrency": { "$arrayElemAt": ["$orderdata.fromCurrency", 0] },
          "toCurrency": { "$arrayElemAt": ["$orderdata.toCurrency", 0] },
        }
      },
      {
        "$match": {
          "_id": mongoose.Types.ObjectId(data._id)
        }
      }
    ], (err, getorder) => {
      if (!err && getorder.length > 0) {
        console.log(getorder, "getorder")
        if (getorder[0].sellerConfirmation == false || getorder[0].sellerConfirmation == "false") {
          var receiverId;
          var receiveAmount;
          var data1 = {};

          if (getorder[0].orderType == "buy") {
            receiverId = getorder[0].buyUserId,
              receiveAmount = getorder[0].price
            if (getorder[0].toCurrency == "ChinTwo") {
              data1 = {
                userId: receiverId,
                amount: receiveAmount.toFixed(4),
                flag: true,
                type: "coin"
              }
            }
            else {
              data1 = {
                userId: receiverId,
                amount: receiveAmount.toFixed(4),
                flag: true,
                type: "token",
                currencyName: getorder[0].toCurrency
              }

            }

          } else {
            receiverId = getorder[0].buyUserId,
              receiveAmount = getorder[0].amount

            if (getorder[0].fromCurrency == "ChinTwo") {
              data1 = {
                userId: receiverId,
                amount: receiveAmount,
                flag: true,
                type: "coin"
              }
            }
            else {
              data1 = {
                userId: receiverId,
                amount: receiveAmount,
                flag: true,
                type: "token",
                currencyName: getorder[0].fromCurrency
              }

            }
          }



          console.log(data1, "data1")
          common.getAPI("escrowDeposit", data1, function (response) {

            if (response.status == true) {
              p2pmappingDB.updateOne({ "_id": mongoose.Types.ObjectId(data._id) }, { "$set": { "sellerConfirmation": true, "sellerDatetime": new Date() } }, (err, buyupdate) => {
                if (!err && buyupdate) {
                  p2porderDB.findOne({ "_id": mongoose.Types.ObjectId(getorder[0].orderId) }, (err, orderdet) => {
                    if (!err && orderdet) {
                      p2porderDB.updateOne({ "_id": mongoose.Types.ObjectId(getorder[0].orderId) }, { "status": 1 }, (err, updated) => {
                        p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, mapdata) => {
                          socket_config.sendmessage("mapDetails", mapdata);
                          res.json({ "status": true, "message": "Seller confirmed successfully" })
                        })
                      })
                    } else {
                      res.json({ "status": false, "message": "Error occurred in seller confirmation. Please try again later" })
                    }
                  })

                } else {
                  res.json({ "status": false, "message": "Error occurred in seller confirmation. Please try again later" })
                }
              })
            }
            else {
              res.json({
                status: false,
                "checking": "else",
                msg: response.message,
              });
            }
          })

        } else {
          res.json({ "status": false, "message": "already confirmed" })
        }
      } else {
        res.json({ "status": false, "message": "Error occurred in get order. Please try again later" })
      }
    })
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
};

//get my advertisement
exports.getMyAdvertisement = async (req, res) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userId);
    p2porderDB.find({ "$and": [{ "userId": userId }, { "status": 0 }] }, (err, getlist) => {
      if (!err && getlist.length > 0) {
        res.json({ "status": true, "message": "success", "data": getlist })
      } else {
        res.json({ "status": true, "message": "success", "data": [] })
      }
    })
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//get my orders
exports.getMyOrders = async (req, res) => {
  try {
    let userid = mongoose.Types.ObjectId(req.userId);
    let data = req.body; //status
    let params = req.body;
    let pageNo = params.page ? params.page : "0";
    let pageSize = params.pageSize ? params.pageSize : "0";
    var skip = +pageNo * pageSize;
    var limit = +pageSize;
    var sort = { dateTime: -1 };

    p2porderDB.aggregate([
      {
        "$lookup": {
          "from": "CT_usvhyhj",
          "localField": "userId",
          "foreignField": "_id",
          "as": "userdata"
        }
      },
      {
        "$lookup": {
          "from": "CT_PPredroMapINg",
          "localField": "_id",
          "foreignField": "orderId",
          "as": "orderdata"
        }
      },
      {
        "$project": {
          "userId": 1,
          "orderType": 1,
          "firstCurrency": 1,
          "secondCurrency": 1,
          "location": 1,
          "marketPrice": 1,
          "marginPercentage": 1,
          "price": 1,
          "amount": 1,
          "minAmount": 1,
          "maxAmount": 1,
          "availableAmount": 1,
          "paymentMethod": 1,
          "paymentDetails": 1,
          "remarks": 1,
          "isKycNeed": 1,
          "dateTime": 1,
          "orderid": 1,
          "buyUserId": { "$arrayElemAt": ["$orderdata.buyUserId", 0] },
          "sellUserId": { "$arrayElemAt": ["$orderdata.sellUserId", 0] },
          // "user": { "$arrayElemAt": ["$userdata._id", 0] },
          "protectKey": { "$arrayElemAt": ["$userdata.protect_key", 0] },
          "unusualKey": { "$arrayElemAt": ["$userdata.unusual_key", 0] },
          "username": { "$arrayElemAt": ["$userdata.username", 0] },
          "bank_info": { "$arrayElemAt": ["$userdata.bank_info", 0] },
          "bank_status": { "$arrayElemAt": ["$userdata.bank_status", 0] },
          "payment": { "$arrayElemAt": ["$userdata.payment", 0] },
          "status": {
            "$cond": {
              "if": { "$eq": ["$status", 0] }, then: "Pending", else: {
                "$cond": {
                  "if": { "$eq": ["$status", 2] }, then: "Progress", else: {
                    "$cond": {
                      "if": { "$eq": ["$status", 3] }, then: "Cancelled", else: {
                        "$cond": {
                          "if": { "$eq": ["$status", 5] }, then: "Progress",
                          else: "Completed"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      { "$match": { "$or": [{ "buyUserId": userid }, { "sellUserId": userid }] } },

      {
        "$sort": sort
      },
      {
        "$skip": skip,
      },
      {
        "$limit": limit,
      },
    ], async (err, result) => {
      if (!err && result.length > 0) {
        var listCount = await p2porderDB.find({}).countDocuments();

        let count = 0;
        for (let i = 0; i < result.length; i++) {
          protect_key = common.decrypt(result[i].protectKey);
          unusual_key = common.decrypt(result[i].unusualKey);
          result[i].email = protect_key + unusual_key;
          count++;
          if (count == result.length) {
            res.json({ "status": true, "data": result, count: listCount })
          }
        }
      } else {
        res.json({ "status": true, "data": [] })
      }
    })

  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//mapping status
exports.mappingStatus = async (req, res) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userId);
    let data = req.body;//_id
    p2pmappingDB.aggregate([
      {
        "$lookup": {
          "from": "CT_usvhyhj",
          "localField": "sellUserId",
          "foreignField": "_id",
          "as": "selluser"
        }
      },
      {
        "$lookup": {
          "from": "CT_usvhyhj",
          "localField": "buyUserId",
          "foreignField": "_id",
          "as": "buyuser"
        }
      },
      {
        "$lookup": {
          "from": "CT_PPordRkFRLUxpcQ",
          "localField": "orderId",
          "foreignField": "_id",
          "as": "orderdata"
        }
      },
      {
        "$project": {
          "sellerId": { "$arrayElemAt": ["$selluser._id", 0] },
          "sellerProtectKey": { "$arrayElemAt": ["$selluser.protect_key", 0] },
          "sellerUnusualKey": { "$arrayElemAt": ["$buyuser.unusual_key", 0] },
          "sellerUsername": { "$arrayElemAt": ["$selluser.user_name", 0] },
          "sellerWalletAddress": { "$arrayElemAt": ["$selluser.hexAddress", 0] },
          "sellerBankstatus": { "$arrayElemAt": ["$selluser.bank_status", 0] },
          "sellerPayment": { "$arrayElemAt": ["$selluser.payment", 0] },
          "buyerId": { "$arrayElemAt": ["$buyuser._id", 0] },
          "buyerProtectKey": { "$arrayElemAt": ["$buyuser.protect_key", 0] },
          "buyerUnusualKey": { "$arrayElemAt": ["$buyuser.unusual_key", 0] },
          "buyerUsername": { "$arrayElemAt": ["$buyuser.user_name", 0] },
          "buyerWalletAddress": { "$arrayElemAt": ["$buyuser.hexAddress", 0] },
          "buyerBankstatus": { "$arrayElemAt": ["$buyuser.bank_status", 0] },
          "buyerPayment": { "$arrayElemAt": ["$buyuser.payment", 0] },
          "firstCurrency": { "$arrayElemAt": ["$orderdata.firstCurrency", 0] },
          "secondCurrency": { "$arrayElemAt": ["$orderdata.secondCurrency", 0] },
          "payments": { "$arrayElemAt": ["$orderdata.paymentMethod", 0] },
          "iskycNeed": { "$arrayElemAt": ["$orderdata.isKycNeed", 0] },
          "userWalletAddress": { "$arrayElemAt": ["$orderdata.userWalletAddress", 0] },
          "fromCurrency": { "$arrayElemAt": ["$orderdata.fromCurrency", 0] },
          "toCurrency": { "$arrayElemAt": ["$orderdata.toCurrency", 0] },
          "dispute": 1,
          "favour": 1,
          "sellerConfirmation": 1,
          "buyerConfirmation": 1,
          "orderId": 1,
          "amount": 1,
          "price": 1,
          "total": 1,
          "orderType": 1,
          "datetime": 1,
          "time": 1,
          "_id": 1,
          "loginStatus": {
            "$cond": {
              "if": { "$eq": [{ "$arrayElemAt": ["$selluser._id", 0] }, userId] }, then: "Seller", else: "Buyer"
            }
          }
        }
      },
      {
        "$match": {
          "orderId": mongoose.Types.ObjectId(data._id)
        }
      }
    ], (err, result) => {
      if (!err && result.length > 0) {
        sellerProtectKey = common.decrypt(result[0].sellerProtectKey);
        sellerUnusualKey = common.decrypt(result[0].sellerUnusualKey);
        result[0].sellerEmail = sellerProtectKey + sellerUnusualKey;
        buyerProtectKey = common.decrypt(result[0].buyerProtectKey);
        buyerUnusualKey = common.decrypt(result[0].buyerUnusualKey);
        result[0].buyerEmail = buyerProtectKey + buyerUnusualKey;
        siteDB.findOne({}, (err, getsitedata) => {
          if (!err && getsitedata != null) {
            result[0].p2ptimer = getsitedata.p2p_timer;
            res.json({ "status": true, "data": result[0] })
          } else {
            result[0].p2ptimer = 0;
            res.json({ "status": true, "data": result[0] })
          }
        })
      } else {
        res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
      }
    })
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
};

//order cancel
exports.orderCancel = async (req, res) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userId);
    let data = req.body;
    if (data._id != undefined && typeof data._id != 'undefined') {
      p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getordermap) => {
        if (!err && getordermap != null) {
          p2porderDB.findOne({ "_id": mongoose.Types.ObjectId(getordermap.orderId) }, async (err, getorder) => {

            if (!err && getorder != null) {
              // if (getorder.status == 2) {

              let orderData = {};

              orderData = {
                userId: getorder.userId,
                placerOwnAddress: getorder.placerOwnAddress,
                fromCurrency: getorder.fromCurrency,
                toCurrency: getorder.toCurrency,
                amount: getorder.amount,
                price: getorder.price,
                total: getorder.total,
                orderType: getorder.orderType,
                userWalletAddress: getorder.userWalletAddress

              };


              if (orderData.orderType == "sell") {

                var senderId = getorder.userId;
                var sendAmount = parseFloat(getorder.amount);
                var data1;

                if (getorder.fromCurrency == "ChinTwo") {
                  data1 = {
                    userId: senderId,
                    amount: sendAmount.toFixed(4),
                    flag: true,
                    type: "coin"
                  }
                }
                else {
                  data1 = {
                    userId: senderId,
                    amount: sendAmount.toFixed(4),
                    flag: true,
                    type: "token",
                    currencyName: getorder.fromCurrency
                  }

                }
                common.getAPI("escrowDeposit", data1, function (response) {
                  if (response.status == true) {

                    p2porderDB.updateOne(
                      { _id: mongoose.Types.ObjectId(getorder._id) },
                      { $set: { status: 3 } },
                      (err, updated) => {
                        if (!err && updated) {
                          p2porderDB.create(orderData, (err, mapcreated) => {
                            if (!err && mapcreated) {
                              res.json({ "status": true, "message": "Order cancelled successfully" })


                            } else {
                              res.json({
                                status: false,
                                message:
                                  "Error . Please try again later",
                              });
                            }
                          }
                          );
                        } else {
                          res.json({
                            status: false,
                            message:
                              "Error in updating status . Please try again later",
                          });
                        }
                      });

                  } else {
                    res.json({
                      status: false,
                      msg: response.message,
                    });
                  }
                })

              } else {


                var senderId = getordermap.sellUserId;
                var sendAmount = parseFloat(getorder.price);
                var data1;

                if (getorder.toCurrency == "ChinTwo") {
                  data1 = {
                    userId: senderId,
                    amount: sendAmount.toFixed(4),
                    flag: true,
                    type: "coin"
                  }
                }
                else {
                  data1 = {
                    userId: senderId,
                    amount: sendAmount.toFixed(4),
                    flag: true,
                    type: "token",
                    currencyName: getorder.toCurrency
                  }

                }
                common.getAPI("escrowDeposit", data1, function (response) {

                  if (response.status == true) {
                    p2porderDB.updateOne(
                      { _id: mongoose.Types.ObjectId(getorder._id) },
                      { $set: { status: 3 } },
                      (err, updated) => {
                        if (!err && updated) {
                          p2porderDB.create(orderData, (err, mapcreated) => {
                            if (!err && mapcreated) {
                              res.json({ "status": true, "message": "Order cancelled successfully" })


                            } else {
                              res.json({
                                status: false,
                                message:
                                  "Error . Please try again later",
                              });
                            }
                          }
                          );
                        } else {
                          res.json({
                            status: false,
                            message:
                              "Error in updating status . Please try again later",
                          });
                        }
                      });

                  } else {
                    res.json({
                      status: false,
                      msg: response.message,
                    });
                  }
                })




              }




              // } else {
              //   res.json({ "status": false, "message": "This order has been already processed" })
              // }
            }
          })
        } else {
          res.json({ "status": false, "message": "Invalid Id" })
        }
      })
    } else {
      res.json({ "status": false, "message": "Id is required" })
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}





//dispute raise
exports.disputeRaise = async (req, res) => {
  try {
    let data = req.body;//_id, proof, reason
    if (data._id != undefined && typeof data._id != 'undefined' && req.file != undefined && typeof req.file != 'undefined' && data.reason != undefined && typeof data.reason != 'undefined' && data.comments != undefined && typeof data.comments != 'undefined') {
      p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getmapdata) => {
        if (!err && getmapdata != null) {
          uploadDisputeProof(req, function (response) {
            if (response) {
              res.json({ "status": true, "message": "Dispute raised successfully" })
            } else {
              res.json({ "status": false, msg: 'Your dispute raise has been failed.' });
            }
          })
        } else {
          res.json({ "status": false, "message": "Invalid Id" })
        }
      })
    } else {
      if (data._id == undefined) {
        res.json({ "status": false, "message": "Id is required" })
      } else if (req.file == undefined) {
        res.json({ "status": false, "message": "Proof is required" })
      } else if (req.comments == undefined) {
        res.json({ "status": false, "message": "comments is required" })
      } else {
        res.json({ "status": false, "message": "Reason is required" })
      }
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

//get dispute raise
exports.getdisputeRaise = async (req, res) => {
  try {
    let data = req.body;//_id, proof, reason

    p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getmapdata) => {
      if (!err && getmapdata != null) {

        var message = {
          proof: getmapdata.proof, reason: getmapdata.reason, disputeComments: getmapdata.disputeComments, user_name: getmapdata.disputeRaiser,
        }
        res.json({
          "status": true, data: message
        })

      }

    })

  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

exports.getNotification = async (req, res) => {
  try {
    let userId = mongoose.Types.ObjectId(req.userId);
    p2pnotiDB.find({ "userId": userId }).sort({ "_id": -1 }).exec((err, getnoti) => {
      if (!err && getnoti.length > 0) {
        res.json({ "status": true, "message": "success", "data": getnoti })
      } else {
        res.json({ "status": true, "message": "success", "data": [] })
      }
    })
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

function uploadDisputeProof(req, callback) {

  var imgArray = [];

  data = req.body;

  if (req.file) {
    var uploaded = 0;

    const fsize = req.file.size;

    const file = Math.round((fsize / 1024));
    if (file <= 1000) {

      s3bucket.uploadImage(req.file, async function (imgRes) {

        if (imgRes.Location) {

          var orgName = imgRes.key;
          var explode = orgName.split('.');
          var filename = explode[1];

          const userTblData = await userDB.findOne({ _id: mongoose.Types.ObjectId(req.userId) });


          let obj = {
            "proof": imgRes.Location,
            "reason": data.reason,
            "dispute": true,
            "disputeComments": data.comments,
            "disputeRaiser": userTblData.user_name
            ,
            "disputeDatetime": new Date(),
            "favour": ""
          }

          p2pmappingDB.updateOne({ "_id": mongoose.Types.ObjectId(data._id) }, { "$set": obj }, (err, updated) => {
            if (!err && updated) {
              p2porderDB.updateOne({ "_id": mongoose.Types.ObjectId(updated.orderId) }, { "$set": { "status": 4 } }, (err, updated) => {
                if (!err && updated) {
                  callback(true);
                } else {
                  callback(false);
                }
              })
            }
          })

        }

      });

    } else {

      uploaded = uploaded + 1;
    }
  } else {

    callback(false);
  }
}

// Dispute Chat With Admin
exports.disputeChat = async (req, res) => {
  try {
    let data = req.body;//_id, message, image
    if (data._id != undefined && typeof data._id != 'undefined' && (data.message != undefined && typeof data.message != 'undefined' || req.file)) {
      data.datetime = new Date();
      data.userId = req.userId;
      p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getmapdata) => {
        if (!err && getmapdata != null) {
          if (getmapdata.buyUserId.toString() == data.userId.toString()
            || getmapdata.sellUserId.toString() == data.userId.toString()) {
            userDB.findOne({ "_id": mongoose.Types.ObjectId(req.userId) }, (err, getuserdata) => {
              if (!err && getuserdata != null) {
                req.user_name = getuserdata.user_name;
                if (req.userId == getmapdata.sellUserId) {
                  req.user_type = "seller"
                }
                else {
                  req.user_type = "buyer"
                }
                disputeChatProof(req, function (response) {
                  if (response) {
                    res.json({ "status": true, "message": "Chat added successfully" })
                  } else {
                    res.json({ "status": false, "message": "Error occurred in p2p chat data. Please try again later" })
                  }
                })
              }
            })


          } else {
            res.json({ "status": false, "message": "Invalid Access" })

          }
        }
        else {
          res.json({ "status": false, "message": "Invalid Id" })
        }
      })
    } else {
      if (data.message == undefined) {
        res.json({ "status": false, "message": "Message is required" })
      } else {
        res.json({ "status": false, "message": "Id is required" })
      }
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}

function disputeChatProof(req, callback) {

  data = req.body;
  if (req.file) {
    var uploaded = 0;

    const fsize = req.file.size;

    const file = Math.round((fsize / 1024));
    if (file <= 1000) {

      s3bucket.uploadImage(req.file, async function (imgRes) {

        if (imgRes.Location) {

          let disputeChats = {
            "message": imgRes.Location,
            "chatuser": req.userId,
            "chatDatetime": new Date(),
            "user_type": req.user_type,
            "user_name": req.user_name,
            "type": "image"
          }

          p2pmappingDB.updateOne({ "_id": mongoose.Types.ObjectId(data._id) }, { "$push": { "disputeChats": disputeChats } }, (err, updated) => {
            if (!err && updated.modifiedCount != 0) {
              socket_config.sendmessage('disputeChatList', disputeChats);
              callback(true);
            }
            else {
              callback(false);
            }
          })
        }
      });
    } else {
      uploaded = uploaded + 1;
    }
  } else {

    let disputeChats = {
      "message": data.message,
      "chatuser": req.userId,
      "chatDatetime": new Date(),
      "user_type": req.user_type,
      "user_name": req.user_name
    }

    p2pmappingDB.updateOne({ "_id": mongoose.Types.ObjectId(data._id) }, { "$push": { "disputeChats": disputeChats } }, (err, updated) => {
      if (!err && updated.modifiedCount != 0) {
        socket_config.sendmessage('disputeChatList', disputeChats);
        callback(true);
      }
      else {
        callback(false);
      }
    })
  }
}

//get chat
exports.getDisputeChats = async (req, res) => {
  try {
    let data = req.body;//_id
    if (data._id != undefined && typeof data._id != 'undefined') {
      p2pmappingDB.findOne({ "_id": mongoose.Types.ObjectId(data._id) }, (err, getmapdata) => {
        if (!err && getmapdata != null) {

          // let data = getmapdata.chats;
          // var message = {
          //   "message": {
          //     proof: getmapdata.proof, reason: getmapdata.reason, disputeComments: getmapdata.disputeComments, user_name: getmapdata.disputeRaiser,
          //   }
          // }
          // console.log(data)
          // data.unshift(message)
          res.json({ "status": true, "data": getmapdata.disputeChats })
          // res.json({ "status": true, "data": data })
        } else {
          res.json({ "status": true, "data": [] })
        }
      })
    } else {
      res.json({ "status": false, "message": "Id is required" })
    }
  } catch (err) {

    res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
  }
}