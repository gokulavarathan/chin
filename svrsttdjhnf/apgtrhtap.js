const createError = require('http-errors');
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const Common = require('../hprftghftgj/nommoc');
var cron = require('node-cron');
const logger = require('morgan');
var pug = require('pug');
var socketio = require('socket.io');
const transactionList = require('../mdlhysreyh/tsiLnoitcasnart')
const common = require("../hprftghftgj/nommoc.js");
const p2porderDB = require("../mdlhysreyh/redorp2p");
const p2pmappingDB = require("../mdlhysreyh/gingppmreors");
const socket_config = require("../hprftghftgj/tekcos");
const p2pnotiDB = require("../mdlhysreyh/ntiononaswr");
const coinUsdDB = require("../mdlhysreyh/noisrevnoc-dsu-nioc");
const coinDB = require("../mdlhysreyh/bunotsp");

var getJSON = require('get-json')
const db = require("../mdlhysreyh/db");
const config = require("../nddetdthtfjh/config");
const getRequestCurl = require('../rellortnoc/lructseuquerteg');
//importing router files
const usersRouter = require('../rtsdthtfh/usrrfgffb');
const bankRouter = require("../eturo/knab")

//importing db
const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const kycTbl = require('../mdlhysreyh/klkrqew');

var rp = require('request-promise');
var cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

//port setup
let port = config.port;
app.set("port", port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://192.168.2.218:3002", 'http://192.168.218.:3001', 'http://192.168.2.218:3000', 'https://novafintech.co.uk');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

//router paths
app.use('/user', usersRouter);
app.use('/bank', bankRouter);



//test
app.get('/test', (req, res) => {
  res.send('Hello!  :)')
})

//logs read
app.get('/logs', (req, res) => {
  let file = path.join(__dirname, '../logs/combined.outerr.log');
  fs.readFile(file, 'utf-8', (err, data) => {
    res.send(data);
  })
})

//logs delete
app.get('/emptyLogs', (req, res) => {
  let file = path.join(__dirname, '../logs/combined.outerr.log');
  fs.writeFile(file, "", (err, data) => {
    res.send("Logs truncated");
  })
})
//error logs 
app.get('/errlogs', (req, res) => {
  let file = path.join(__dirname, '../logs/error.log');
  fs.readFile(file, 'utf-8', (err, data) => {
    res.send(data);
  })
})



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// if (process.env.NODE_ENV == 'local' || process.env.NODE_ENV == '') 
//   {
//     server = http.createServer(app);
//   }
//   else {
//     var options = {
//       key: fs.readFileSync('ccr.key'),
//       cert: fs.readFileSync('ccr.crt')
//       };
//       server = https.createServer(options, app);  
//   }

let server;
if (config.serverType == "http") {

  const http = require("http");
  server = http.createServer(app);
} else {


  const https = require("https");
  server = https.createServer(config.serverOptions, app);
}


cron.schedule('*/1 * * * *', () => {
  // cron.schedule('* */1 * * *', () => {
  // exports.apiUpdate = (req,res)=>{
  console.log("cron");
  var where = { "cur_type": "stable" }
  coinUsdDB.find(where,
    (err, result) => {

      let i;

      for (i = 0; i < result[0].currencies.length; i++) {

        var currencyUpdate = result[0].currencies

        updatePrice2(currencyUpdate, i);
      }
    });
})

updatePrice2 = (currencyUpdate, i) => {
  try {
    var priceAPI = "https://openexchangerates.org/api/latest.json?app_id=9ff80ba1f8344ce0b1f120dff4ba6104"


    getJSON(priceAPI, (error, response) => {

      if (response != undefined) {

        if ((Object.keys(response).length != 0) && response != null) {
          // console.log("-------------------> ~ response.rates[symb]", response.rates[symb])

          // if (response.rates[symb] != undefined) {

          var id = currencyUpdate[i]._id.toString()
          var symb = currencyUpdate[i].symbol.toUpperCase();
          var updatedRate = 1 / +response.rates[symb];
          // console.log("-------------------> ~ updatedRate", updatedRate)

          coinUsdDB.updateOne({ "currencies._id": id }, {
            "$set": {

              "currencies.$.usd_price": updatedRate

            }
          }, ((err, doc) => {
            // console.log("-------------------> ~ err", err)
            // console.log("-------------------> ~ doc", doc)
            if (!err && doc != undefined) {



              coinDB.updateOne({ "symbol": currencyUpdate[i].symbol.toUpperCase() },

                {
                  "$set": {
                    "convert": response.rates[currencyUpdate[i].symbol.toUpperCase()]
                  }
                }

                , (err, resp) => {
                  // console.log(resp,err)
                  if (!err && resp) {
                    // console.log("donnnne")
                  } else {
                    console.log("no", err)
                  }
                })


            } else {
              // console.log("error1", err)
            }
          }))

          // } else {
          //   console.log("undefined");
          // }
        } else {
          // console.log('obj--------> nothing happen')

        }


      } else {
        // setTimeout(() => {
        //   console.log('obj--------> nothing happen245646')
        // console.log('err---->', error)
        //   updatePrice(currencyUpdate, i);

        // }, 9000)

      }
    })
  }
  catch (e) {
    console.log(e, "e")
  }

}




cron.schedule('*/1 * * * *', () => {
  transactionList.find({ result: "undefined" }, (err, data) => {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        // 
        var val = {
          type: data[i].Transfer_type,
          hash: data[i].approvehash,
          transferList: data[i].user_id.toString(),
          _id: data[i]._id

        }
        Common.getAPI("crontx", val, function (ethApicontract) {
          if (ethApicontract.status) {

          }
        })
      }


    }

  })
});




var test = new Date(+new Date().getTime() + 10 * 60000)


var Date11 = new Date().getTime()



cron.schedule('*/10  * * * * *', () => {
  var Date1 = new Date().getHours()

  p2porderDB.find({ status: 2 }, (err, orderdata) => {
    if (orderdata) {
      for (var i = 0; i < orderdata.length; i++) {
        p2pmappingDB.findOne({ orderId: orderdata[i]._id }, (err, data) => {
          // console.log(data, "data")
          let startDate = data.datetime
          let endDate = new Date();
          let seconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
          // console.log(seconds, "condn1")

          // console.log(seconds >= 60, "condn2")
          if (seconds >= 60) {
            p2porderDB.findOne({ "_id": data.orderId }, (err, result) => {
              // console.log(result, "result")

              if (!err && result) {

                let orderData = {};
                orderData = {
                  userId: result.userId,
                  placerOwnAddress: result.placerOwnAddress,
                  fromCurrency: result.fromCurrency,
                  toCurrency: result.toCurrency,
                  userWalletAddress: result.userWalletAddress,
                  amount: result.amount,
                  price: result.price,
                  total: result.total,
                  orderType: result.orderType,
                  approvehash: result.transhash,

                };


                if (orderData.orderType == "sell") {

                  var senderId = result.userId;
                  var sendAmount = parseFloat(result.amount);
                  var data1;

                  if (result.fromCurrency == "ChinTwo") {
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
                      currencyName: result.fromCurrency
                    }

                  }
                  common.getAPI("escrowDeposit", data1, function (response) {
                    if (response.status == true) {

                      p2porderDB.updateOne(
                        { _id: mongoose.Types.ObjectId(result._id) },
                        { $set: { status: 3 } },
                        (err, updated) => {
                          if (!err && updated) {
                            p2porderDB.create(orderData, (err, mapcreated) => {
                              if (!err && mapcreated) {
                                // res.json({ "status": true, "message": "Order cancelled successfully" })


                              } else {
                                // res.json({
                                //   status: false,
                                //   message:
                                //     "Error . Please try again later",
                                // });
                                console.log("Error . Please try again later:" + err)
                              }
                            }
                            );
                          } else {
                            // res.json({
                            //   status: false,
                            //   message:
                            //     "Error in updating status . Please try again later",
                            // });
                            console.log("Error in updating status . Please try again later:" + err)
                          }
                        });

                    } else {
                      // res.json({
                      //   status: false,
                      //   msg: response.message,
                      // });
                      console.log(" Please try again later:" + err)

                    }
                  })

                } else {
                  console.log("buy condition")


                  var senderId = data.sellUserId;
                  var sendAmount = parseFloat(result.price);
                  var data1;

                  if (result.toCurrency == "ChinTwo") {
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
                      currencyName: result.toCurrency
                    }

                  }
                  common.getAPI("escrowDeposit", data1, function (response) {
                    console.log(data1, "data1")

                    if (response.status == true) {
                      p2pmappingDB.create(orderData, (err, mapcreated) => {
                        if (!err && mapcreated) {
                          console.log(mapcreated, "mapcreated")
                          p2porderDB.updateOne(
                            { _id: mongoose.Types.ObjectId(result._id) },
                            { $set: { status: 3 } },
                            (err, updated) => {
                              if (!err && updated) {
                                console.log(updated, "updated")
                                // res.json({ "status": true, "message": "Order cancelled successfully" })


                              } else {
                                // res.json({
                                //   status: false,
                                //   message:
                                //     "Error . Please try again later",
                                // });
                                console.log("Error . Please try again later:" + err)
                              }
                            }
                          );
                        } else {
                          // res.json({
                          //   status: false,
                          //   message:
                          //     "Error in updating status . Please try again later",
                          // });
                          console.log("Error in updating status . Please try again later:" + err)
                        }
                      });

                    } else {
                      // res.json({
                      //   status: false,
                      //   msg: response.message,
                      // });
                      console.log(" Please try again later:" + err)

                    }

                  })




                }









              } else {
                // console.log(err, "err")

              }
            }
            )
          }

        })
      }


    }

  })
});


cron.schedule('*/20  * * * *', () => {
  // exports.apiUpdate = (req,res)=>{
  var where = { "cur_type": "crypto" }
  coinUsdDB.find(where,
    (err, result) => {
      // console.log(result,"res1");
      let i;
      for (i = 0; i < result[0].currencies.length; i++) {
        // for(i=0;i<1;i++){

        // console.log(result[0].currencies[i].currency,"res2")
        var currencyUpdate = result[0].currencies

        updatePrice(currencyUpdate, i);
      }
    });
})


updatePrice = (currencyUpdate, i) => {
  try {
    let cname = currencyUpdate[i];

    let TokenData = { ...cname }._doc;
    let cname2 = TokenData.currency.toUpperCase();

    var tocurr = 'usd'

    // var pricepair ="https://api.coingecko.com/api/v3/simple/price?ids="+cname2+"&vs_currencies="+tocurr


    var pricepair2 = "https://api.binance.com/api/v3/ticker/24hr?symbol=" + cname2 + "USDT"


    getJSON(pricepair2, (error, response) => {

      if (response != undefined) {

        if ((Object.keys(response).length != 0) && response != null) {



          var id = currencyUpdate[i]._id.toString()


          coinUsdDB.updateOne({ "currencies._id": id }, {
            "$set": {
              // "currencies.$.usd_price":	response[cname2].usd
              "currencies.$.usd_price": response.lastPrice
              // "usd_price":response[cname2].usd,		
            }
          }, ((err, doc) => {
            if (!err && doc) {
              // console.log("done")
            } else {
              // console.log("error1",err)
            }
          }))
        } else {
          console.log('obj--------> nothing happen')

        }


      } else {
        console.log('obj--------> nothing happen245646')
        updatePrice(currencyUpdate, i);
      }




    })
  }
  catch (e) {
    console.log(e, "e")
  }

}



// // cron.schedule('*/20  * * * *', () => {
//   exports.apiUpdate = (req,res)=>{
//     var where={"cur_type":"stable"}
//       coinUsdDB.find(where,
//       (err, result) => {
//         console.log(result,"res1");
//         let i;
//         for(i=0;i<result[0].currencies.length;i++){
//         // for(i=0;i<1;i++){

//           console.log(result[0].currencies[i].currency,"res2")
//         var currencyUpdate = result[0].currencies

//         updatePrice2(currencyUpdate, i);
//         }
//       });
//   }

//   updatePrice2 =  (currencyUpdate, i)=>{
//     try{


//   // var pricepair ="https://api.coingecko.com/api/v3/simple/price?ids="+cname2+"&vs_currencies="+tocurr


// //  var pricepair2="https://api.binance.com/api/v3/ticker/24hr?symbol="+cname2+"USDT"

//  var priceAPI="https://openexchangerates.org/api/latest.json?app_id=9ff80ba1f8344ce0b1f120dff4ba6104"


//     getJSON(pricepair2, (error, response)=>{
//   console.log(response,"response")
//         if(response !=undefined){

//           if((Object.keys(response).length != 0 )  && response!=null){



//             var id=currencyUpdate[i]._id.toString()


//                    coinUsdDB.updateOne({ "currencies._id" : id}, {"$set":{
//                     // "currencies.$.usd_price":	response[cname2].usd
//                     "currencies.$.usd_price":	response.rates
//                     // "usd_price":response[cname2].usd,		
//                   } }, ((err,doc)=>{
//                     if(!err && doc){
//                       // console.log("done")
//                     }else{
//                       console.log("error1",err)
//                     }
//                   }))
//                 }else {
//                   console.log('obj--------> nothing happen')

//                 }


//             }else {
//               console.log('obj--------> nothing happen245646')
//               updatePrice(currencyUpdate, i);
//             }




//           })
//         }
//         catch(e){
//           console.log(e,"e")
//         }

//   }





let orderEmit = exports.orderEmit = (Id) => {
  socket_config.sendmessage('emitMapping', { "_id": Id })
}

var io = socketio(server, {
  cors: {
    origin: '*',
  },
  serveClient: false,
  pingTimeout: 6000000,
  pingInterval: 30000,
  cookie: false
});

socket_file = require('../hprftghftgj/tekcos');
socket_file.initiate(io);

io.on('connection', (socket) => {

  socket.on("chatroom", async (orderId) => {

    console.log("checking", orderId)
  })

  socket.on('connect', (param) => {
    socket.join(param)
  })

  socket.on('sendMessage', (param) => {
    socket.join(param.message)
  })

  socket.emit("event", "message")


  return io;
})





server.listen(port, () => console.log(`Front server running ` + port));


module.exports = app;
