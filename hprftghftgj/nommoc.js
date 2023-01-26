const CryptoJS = require("crypto-js");
const mongoose = require('mongoose');
const express = require('express');
const cointoken = require('../mdlhysreyh/bunotsp')
const usertoken = require('../mdlhysreyh/cionsdf')
const transactionList = require('../mdlhysreyh/tsiLnoitcasnart')
const user = require('../mdlhysreyh/usrscdsfgesdg');
const allTokensList = require('../mdlhysreyh/tsiLnekotTlla');
const userDB = require('../mdlhysreyh/usrscdsfgesdg');
const fiatList = require('../mdlhysreyh/knabledom')
const jwt = require('jsonwebtoken');
const BlockWeb = require("blockweb")
const { createProxyMiddleware } = require('http-proxy-middleware');
const Request = require('request');
const config = require('../nddetdthtfjh/config');
const transferList = require('../mdlhysreyh/tsilrefsnart')
const depositList = require('../mdlhysreyh/dylyonj')
const withdrawList = require('../mdlhysreyh/wdidrth')
const fiatbankTbl = require('../mdlhysreyh/knabledom')
const stakeToken = require('../mdlhysreyh/ekastsnekot')
const p2porderDB = require("../mdlhysreyh/redorp2p");
const p2pmappingDB = require("../mdlhysreyh/gingppmreors");
const srTbl = require('../mdlhysreyh/srtbldfgvdf');
const stripeTbl = require('../mdlhysreyh/strpdtls')
const chatRoom = require('../mdlhysreyh/chatroom')
var hex = require('string-hex')
let key = CryptoJS.enc.Base64.parse(config.cryptoKey);
let iv = CryptoJS.enc.Base64.parse(config.cryptoIv);
let jwtTokenAdmin = config.jwtTokenAdmin;

let encrypt = exports.encrypt = (value) => {
    let cipher = CryptoJS.AES.encrypt(value, key, { iv: iv }).toString();
    return cipher;
};

let decrypt = exports.decrypt = (value) => {
    let decipher = CryptoJS.AES.decrypt(value, key, { iv: iv });
    let decrypt_val = decipher.toString(CryptoJS.enc.Utf8);
    return decrypt_val;
};

exports.createPayload = (key) => {
    let userid = encrypt(key);
    let payload = { subject: userid };
    let token = jwt.sign(payload, jwtTokenAdmin, { "expiresIn": 60 * 60 }); //60 * 30
    return token;
}

exports.tokenMiddlewareAdmin = (req, res, next) => {
    if (req.headers.authorization) {

        let token = req.headers.authorization.split(' ')[1];

        if (token != null) {
            jwt.verify(token, jwtTokenAdmin, (err, payload) => {
                if (payload) {
                    let userid = decrypt(payload.subject);
                    req.userId = userid;
                    next();
                } else {
                    res.json({ "status": false, "msg": "Unauthorized!" })
                }
            })
        } else {
            res.json({ "status": false, "msg": "Unauthorized2" })
        }
    } else {
        res.json({ "status": false, "msg": "Unauthorized3" })
    }
}

exports.siteUrl = (req) => {
    return req.headers.origin + "/";
}
exports.getIPAddress = (request) => {
    var ip =
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(",")[0];
    ip = ip.split(":").slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip[0];
};

exports.checkIpBlockAddress = (req, res, next) => {

    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');

    res.json({ "status": true, "msg": "" })

}
const contractURL = exports.contractAddress = (req) => {
    return "http://44.198.210.6:46667/wallet"
    // return decrypt('+XxS3LnRNvC0vi1ohYOibCvrAERf9bTA/Mlrr/IR9d6EEQyfFY1VLF6FCcn9awbR');
}
exports.contractAddress = (req) => {
    return "http://44.198.210.6:46667/wallet"

    // return decrypt('+XxS3LnRNvC0vi1ohYOibCvrAERf9bTA/Mlrr/IR9d6EEQyfFY1VLF6FCcn9awbR');
}

exports.freezeBalance = (req) => {
    return "http://44.198.210.6:46667/wallet"

    // return decrypt('+XxS3LnRNvC0vi1ohYOibCvrAERf9bTA/Mlrr/IR9d6EEQyfFY1VLF6FCcn9awbR');
}

let ownerAddress = exports.ownerAddress = (req) => {
    return "1c40129e8e93661724452426af53273930403551ea"

    // return decrypt('4HBOcppC/ODqMbF9d3/w4NDaIvPVpKvmil2lJUSiZ0NRH9gFEmBf2MIxEweduLH5');
}
exports.ownerAddress = (req) => {
    return "1c40129e8e93661724452426af53273930403551ea"

    // return decrypt('4HBOcppC/ODqMbF9d3/w4NDaIvPVpKvmil2lJUSiZ0NRH9gFEmBf2MIxEweduLH5');
}
exports.ownerPrivateKey = (req) => {
    return "a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b"

    // return decrypt('F5sWa1WKHXsVeDsJnX8CqaLCYomxUgGqCpRM+VRrA9+eUI2qjChUyKjzlP6LUIWZS4FKOgUmvk4YdG1yJtFWz08lcRRTD4fEk0mpXrUBgdQ=');
}

exports.ownerAddress2 = (req) => {
    return decrypt('PGirbSTMVpdETbT2umcO/UO44oLxISmrKswoy6jLwSpDIrDmtTngTCh5+gJSS3aR');
}


module.exports.generateroomid = async function (orderId) {
    let availableRoomIds = await chatRoom.findOne({ orderId: orderId, status: true });
    console.log("-------------------> ~ availableRoomIds", availableRoomIds)
    if (availableRoomIds == null) {
        let temp = [];
        let p2pmapdb = await p2pmappingDB.findOne({ _id: orderId });
        console.log("-------------------> ~ p2pmapdb", p2pmapdb)

        temp.push(p2pmapdb.sellUserId);
        temp.push(p2pmapdb.buyUserId);
        console.log("-------------------> ~ temp", temp)
        let genId = uuidv4();
        const roomGen = await chatRoom.create({

            orderId: orderId,
            RoomId: genId,
            users: temp,
            created_at: Math.round(Date.now() / 1000)

        });
        console.log("-------------------> ~ roomGen", roomGen)
        return genId
    }

    if (availableRoomIds != null) {

        return availableRoomIds.RoomId

    }
}





function onProxyRes(proxyRes, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

}



const fullNode = "http://44.198.210.6:46667";
const solidityNode = "http://44.198.210.6:46667";
const eventServer = "http://44.198.210.6:2096";

const privateKey = "a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b"
var fullnode = express();
fullnode.use('/', createProxyMiddleware({
    target: "http://44.198.210.6:46667", //-> instance
    changeOrigin: true,
    onProxyRes
}));
fullnode.listen(56672);

var soliditynode = express();
soliditynode.use('/', createProxyMiddleware({
    target: "http://44.198.210.6:46667", //-> instance
    changeOrigin: true,
    onProxyRes,
}));
soliditynode.listen(56673);


module.exports.getdetail = async (req, res) => {

    var address = "1c40129e8e93661724452426af53273930403551ea"
    var destkey = "a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b"

    const blockweb1 = new BlockWeb(
        fullNode,
        solidityNode,
        eventServer,
        destkey
    );

    const instance = await blockweb1.contract().at(address);
    let
        totalSupply = await instance["totalSupply"]().call();
    var t2 = totalSupply.toString();
    res.json({ status: true, CUSD_total_Supply: t2, Chin_total_Supply: "1000000000" });

}




exports.getAPI = async function (method, value, callback, req, res) {
    var response;

    let contractURL = "http://44.198.210.6:46667/wallet";
    let ownerPrivateKey = "a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b";
    let ownerAddress = "1c40129e8e93661724452426af53273930403551ea";



    switch (method) {
        case "balanceof":
            try {


                var address = value.hexAddress;

                var destkey = value.destkey;
                var finalRes = []
                cointoken.find({}, async (err, isCoinExists) => {
                    var len = isCoinExists.length;
                    for (var i = 1; i < len; i++) {

                        let TokenData = isCoinExists[i]

                        let TokenData1 = { ...TokenData }._doc;
                        var tokenAdd = TokenData1.hexAddress;

                        const blockweb1 = new BlockWeb(
                            fullNode,
                            solidityNode,
                            eventServer,
                            destkey
                        );
                        const instance = await blockweb1.contract().at(tokenAdd);
                        let result = await instance["balanceOf"](address).call();

                        response = { tName: TokenData1.name, balance: result / Math.pow(10, 6).toString(), convert: TokenData1.convert, type: TokenData1.type };
                        finalRes[i - 1] = response

                        if (i + 1 == len) {
                            callback(finalRes)
                        }



                    }
                })



            } catch (e) {
                res.json(e)

            }
            break;

        case "getSpecToken":

            try {
                var address = req.hexAddress;
                var tokenName = req.buyCurrency

                cointoken.findOne({ name: tokenName }, async (err, isCoinExists) => {
                    if (!err && isCoinExists) {
                        let TokenData = { ...isCoinExists }._doc;
                        var tokenAdd = TokenData.hexAddress;


                        address = address.toString();
                        destkey = destkey.toString();
                        tokenAdd = tokenAdd.toString();
                        const blockweb1 = new BlockWeb(
                            fullNode,
                            solidityNode,
                            eventServer,
                            destkey
                        );
                        const instance = await blockweb1.contract().at(tokenAdd);
                        let result = await instance["balanceOf"](address).call();

                        response = { status: true, balance: result.toString() };

                        result = { tName: tokenName, balance: result.toString() }
                        callback(result)


                    }
                })

            } catch (e) {
                response = { status: false, Error: e };

            }
            break;

        case "getdetail":
            try {
                console.log("dere", value)
                var destkey = value.destkey;
                const blockweb1 = new BlockWeb(
                    fullNode,
                    solidityNode,
                    eventServer,
                    destkey
                );
                var userId1 = value.userId
                var tokenAddress = value.tokenAddress;
                var hexAddress = value.hexAddress;
                var hash = value.hash;



                var getaddress = blockweb1.address.fromHex(tokenAddress)


                const instance = await blockweb1.contract().at(getaddress);

                let object = {
                    userId: userId1,
                    address: getaddress,
                    hexAddress: tokenAddress,
                    name: await instance["name"]().call(),
                    symbol: await instance["symbol"]().call(),
                    totalSupply: await instance["totalSupply"]().call(),
                    decimals: await instance["decimals"]().call(),
                    hash: hash, dated: Date.now(),
                    deployType: 'token'

                }


                allTokensList.create(object, async function (err, resData) {
                    if (!err && resData) {

                        callback({
                            status: true,
                            data: object, message: "Token Deployed Successfully", resData: resData
                        })

                    } else {
                        callback({
                            status: false,
                            data: object, message: "Error in token deployment", error: err
                        })

                    }
                })
            } catch (e) {

            }

            break;
        case "escrowDeposit":
            let flag = value.flag
            let userId = value.userId;
            let amount = amountConvert(value.amount, 6, "towei")
            let requestParams;
            console.log(value, "value")
            if (value.type == "coin") {
                console.log("coin")
                var isExist = userDB.findOne({ "_id": userId }, async (err, getuser) => {
                    if (isExist) {
                        var pvtkey1 = decrypt(getuser.endRandom)
                        var pvtkey2 = decrypt(getuser.aceRandom)
                        var pvtkey3 = pvtkey1 + pvtkey2;
                        var pvtkey;
                        //if flag true -- from admin to user
                        if (flag) {
                            requestParams = { "to_address": getuser.hexAddress, "owner_address": ownerAddress, "amount": +amount, fee_limit: 1000000 }
                            pvtkey = ownerPrivateKey;
                            console.log(requestParams, "requestParams")
                        } else {
                            requestParams = { "to_address": ownerAddress, "owner_address": getuser.hexAddress, "amount": +amount, fee_limit: 1000000 }
                            pvtkey = pvtkey3
                            console.log(requestParams, "requestParams2")

                        }
                        await Request({

                            url: contractURL + "/createtransaction",
                            method: "POST",
                            json: true,
                            body: requestParams

                        }, async function (error, response, body) {
                            console.log("-------------------> ~ body", body)
                            // console.log("-------------------> ~ response", response)
                            console.log("-------------------> ~ error", error)

                            if (response.statusCode === 200) {

                                if (!body.Error) {

                                    let rawData = body.raw_data;
                                    let rawDataHex = body.raw_data_hex;

                                    let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': pvtkey }
                                    await Request({

                                        url: contractURL + "/gettransactionsign",
                                        method: "POST",
                                        json: true,
                                        body: signTransParams

                                    }, async function (signError, signResponse, signBody) {


                                        if (!signBody.Error) {

                                            await Request({

                                                url: contractURL + "/broadcasttransaction",
                                                method: "POST",
                                                json: true,
                                                body: signBody

                                            }, async function (broadCastError, broadCastResponse, broadCastBody) {


                                                if (!broadCastBody.Error) {

                                                    if (broadCastBody.result) {
                                                        let transhash = broadCastBody.txid;
                                                        console.log(transhash, "transhash")
                                                        callback({ status: true, message: 'coin transfered to admin', transhash: transhash });


                                                    } else {

                                                        return callback({ status: false, message: 'broadCast status failed' });
                                                    }

                                                } else {

                                                    return callback({ status: false, message: 'Transaction broadCast failed' });
                                                }
                                            })

                                        } else {

                                            return callback({ status: false, message: 'Transaction sign failed' });
                                        }
                                    })

                                } else {

                                    return callback({ status: false, message: body.Error });
                                }

                            } else {

                                return callback({ status: false, message: 'Please try again later' });
                            }
                        });
                    } else {

                        return callback({ status: false, message: "Invalid user ID" });
                    }
                })
            } else if (value.type == "token") {
                let currencyName = value.currencyName;
                console.log(currencyName, "currencyName")
                let depositAmt2 = value.amount;
                var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(userId) });
                console.log(validUser, "validUser------------------");
                var pvtkey1 = decrypt(validUser.endRandom)
                var pvtkey2 = decrypt(validUser.aceRandom)
                var fromAddress = validUser.hexAddress
                var Userpvtkey = pvtkey1 + pvtkey2

                let Userpvtkey1;

                if (validUser) {
                    if (validUser.kyc_status == 1) {
                        cointoken.findOne({ name: currencyName }, (err, isCoinExists) => {
                            if (!err && isCoinExists) {
                                console.log(isCoinExists, "isCoinExists---------------");
                                let TokenData1 = { ...isCoinExists }._doc;

                                var tokenAddress = TokenData1.hexAddress;
                                var tokenDecimal = TokenData1.decimals

                                let requestParams = { value: tokenAddress.toString() };

                                Request({

                                    url: contractURL + "/getcontract",
                                    method: "POST",
                                    json: true,
                                    body: requestParams


                                }, async function (error, response, body) {
                                    console.log(requestParams, "requestParams-------------");
                                    if (flag) {
                                        var toaddress = fromAddress;
                                        Userpvtkey1 = ownerPrivateKey

                                    } else {
                                        var toaddress = ownerAddress
                                        Userpvtkey1 = Userpvtkey.toString();

                                    }


                                    var amount = amountConvert(depositAmt2, 6, "towei")
                                    console.log(amount, "------------------amount");

                                    const blockWeb5 = new BlockWeb(
                                        fullNode,
                                        solidityNode,
                                        eventServer,
                                        Userpvtkey1
                                    );

                                    var isvalidAdd = await blockWeb5.isAddress(fromAddress)


                                    if (isvalidAdd == true) {

                                        let instance = await blockWeb5.contract().at(tokenAddress);


                                        let balresult = await instance["balanceOf"](tokenAddress).call();

                                        var res = await instance["transfer"](
                                            toaddress,
                                            amount.toString()
                                        ).send({ fee_limit: 1000000 });
                                        console.log(res, "-------------res");

                                        callback({ status: true, message: "token transfered to admin", approvehash: res });

                                    } else {

                                        callback({ status: false, "Error": err, "MESSAGE": "NOT VALID ADDRESS" })
                                    }

                                })

                            } else {
                                callback({ status: false, "Error": err, message: "token Not exist" })
                            }
                        })
                    } else {

                        callback({ status: false, message: "KYC is not verified" });
                    }

                } else {

                    callback({ status: false, message: "Invalid user ID" });
                }
            } else {
                callback()
            }

            break;

        case "txforfiat":

            try {

                let checkExist = await fiatList.findOne({ _id: value.id })

                let requestParams = { value: value.transhash }

                if (value.type == "coinTransfer") {
                    Request({

                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {

                        let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                        let to_address = idbody.raw_data.contract[0].parameter.value.to_address


                        let type = idbody.raw_data.contract[0].type;
                        if (type == "TransferContract") {
                            let requestParams = { value: value.transhash }
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    let blockNumber;
                                    let contract_address;
                                    let result;
                                    let time;
                                    let fee
                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = "",
                                            result = "undefined",
                                            time = "",
                                            fee = "";
                                    } else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contract_address,
                                            result = infobody.receipt.result,
                                            time = infobody.blockTimeStamp,
                                            fee = infobody.fee;
                                    }
                                    let object = {
                                        'user_id': checkExist.userId,
                                        'amount': +checkExist.transaction_amount,
                                        'to': checkExist.currency_code,
                                        "approvehash": checkExist.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": to_address

                                    }
                                    transactionList.create(object, async function (err, resData) {
                                        if (!err) {

                                            callback({ status: true, msg: "Your fiat deposit (coin) has been submitted successfully", resData: resData })
                                        } else {

                                        }

                                    })


                                })
                        }


                    })



                }
                else {
                    Request({

                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {

                        let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                        let to_address = idbody.raw_data.contract[0].parameter.value.to_address


                        let type = idbody.raw_data.contract[0].type;
                        if (type == "TriggerSmartContract") {
                            let requestParams = { value: value.transhash }

                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    let blockNumber;
                                    let contract_address;
                                    let result;
                                    let time;
                                    let fee
                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = "",
                                            result = "undefined",
                                            time = "",
                                            fee = "";
                                    } else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contract_address,
                                            result = infobody.receipt.result,
                                            time = infobody.blockTimeStamp,
                                            fee = infobody.fee;
                                    }
                                    let object = {
                                        'user_id': checkExist.userId,
                                        'amount': +checkExist.transaction_amount,
                                        'paymentCurrency': checkExist.currency_code,
                                        "approvehash": checkExist.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": to_address

                                    }

                                    transactionList.create(object, async function (err, resData) {
                                        if (!err) {

                                            callback({ status: true, msg: "Your fiat deposit (token) has been submitted successfully", resData: resData })
                                        } else {

                                        }

                                    })


                                })
                        }


                    })
                }


            } catch (e) {

            }
            break;

        case "txfortransfer":
            try {

                let checkExist = await transferList.findOne({ _id: value.transferList })
                if (value.type == "coinTransfer") {
                    let requestParams = { value: value.hash };


                    Request({
                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {
                        let type = idbody.raw_data.contract[0].type;
                        let amount;
                        let time;
                        let result;

                        if (type == "TransferContract") {
                            let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                            let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                            amount = idbody.raw_data.contract[0].parameter.value.amount;
                            time = idbody.raw_data.timestamp;
                            divAmount = amountConvert(amount, 6, "fromwei")

                            if (idbody.ret != undefined) {
                                result = idbody.ret[0].contractRet

                            } else {
                                result = "undefined"
                            }
                            let requestParams = { value: hash }

                            // setTimeout(function () {
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    console.log("-------------------> ~ infobody", infobody)
                                    let blockNumber;
                                    let contract_address;
                                    let fee = ""

                                    // let exactfee = fee / 1000000;

                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = ""
                                    } else if (infobody.receipt.net_usage == undefined) {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_fee
                                    }

                                    else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_usage,

                                            // result = infobody.receipt.result;
                                            time = infobody.blockTimeStamp

                                    }
                                    console.log("-------------------> ~ fee", fee)
                                    console.log("-------------------> ~typ fee", typeof (fee))

                                    let exactfee = +fee / 1000000;
                                    console.log("-------------------> ~ exactfee", exactfee)

                                    let object = {
                                        'user_id': checkExist.user_id,
                                        'amount': checkExist.amount,
                                        'transhash': value.hash,
                                        'from': checkExist.token,
                                        'to': "",
                                        'type': "Transfer",
                                        'depositType': 0,
                                        'status': 1,
                                        "approvehash": value.hash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": +exactfee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": to_address,


                                    }
                                    console.log("obj coin transfr", object)
                                    transactionList.create(object, async function (err, resData) {
                                        if (!err) {


                                            callback({ status: true, resData: resData })
                                        } else {
                                            callback({ status: false, msg: err });
                                        }

                                    })


                                })
                            // }, 9000)
                        }

                    })


                } else if (value.type == "tokenTransfer") {
                    let requestParams = { value: value.hash };


                    Request({
                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {
                        let type = idbody.raw_data.contract[0].type;
                        let amount;
                        let time;
                        let result;


                        if (type == "TriggerSmartContract") {
                            let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                            let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                            amount = idbody.raw_data.contract[0].parameter.value.amount;
                            time = idbody.raw_data.timestamp;

                            if (idbody.ret != undefined) {
                                result = idbody.ret[0].contractRet

                            } else {
                                result = "undefined"
                            }
                            let requestParams = { value: hash }
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    let blockNumber;
                                    let contract_address;
                                    let fee = ""

                                    //    let exactfee = fee / 1000000;

                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = ""
                                    } else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = ""

                                    }



                                    let object = {
                                        'user_id': checkExist.user_id,
                                        'amount': checkExist.amount,
                                        'transhash': value.hash,
                                        'from': checkExist.token,
                                        'to': "",
                                        "type": "Transfer",
                                        'depositType': 0,
                                        'status': 1,
                                        "approvehash": value.hash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": value.to_address

                                    }
                                    console.log(object, "transfer object")
                                    transactionList.create(object, async function (err, resData) {
                                        if (!err) {


                                            callback({ status: true, resData: resData })
                                        } else {
                                            callback({ status: false, msg: err });
                                        }

                                    })


                                })
                        }

                    })
                }

            } catch (e) {

                res.json(e)
            }
            break;

        case "crontx":
            try {

                console.log("----------------------------------------cron");
                if (value.type == "TransferContract") {
                    let requestParams = { value: value.hash };

                    console.log("-------------------> ~ requestParams", requestParams)
                    Request({
                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {

                        // if(idbody.length != undefined){


                        // let type = idbody.raw_data.contract[0].type;
                        let time;
                        let result;
                        if (value.type == "TransferContract") {
                            let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                            let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                            time = idbody.raw_data.timestamp;

                            if (idbody.ret != undefined) {
                                result = idbody.ret[0].contractRet

                            } else {
                                result = "undefined"
                            }
                            let requestParams1 = { value: value.hash }
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams1

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    console.log("-------------------> ~ infobody", infobody)

                                    let blockNumber;
                                    let contract_address;
                                    let fee;
                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = ""
                                    } else if (infobody.receipt.net_usage == undefined) {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_fee
                                    }

                                    else {
                                        blockNumber = infobody.blockNumber,

                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_usage,
                                            // result = infobody.receipt.result;
                                            time = infobody.blockTimeStamp

                                    }
                                    let exactfee = fee / 1000000
                                    let object = {
                                        'user_id': value.transferList,
                                        'transhash': value.hash,

                                        'depositType': 0,
                                        'status': 1,
                                        "approvehash": value.hash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": +exactfee,
                                        "owner_address": owner_address,
                                        "Transfer_type": "TransferContract",
                                        "to_address": to_address

                                    }
                                    // console.log("-------------------> ~ object", object)

                                    transactionList.updateOne({ '_id': value._id }, { $set: object }, async function (err, resData) {
                                        console.log("-------------------> ~ resData", resData)
                                        if (!err) {
                                            callback({ status: true, response: resData })
                                        } else {

                                        }

                                    })


                                })
                        }
                        // }


                    })

                }
                else if (value.type == "TriggerSmartContract") {
                    let requestParams = { value: value.hash };



                    Request({
                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {

                        // let type = idbody.raw_data.contract[0].type;
                        let amount;
                        let time;
                        let result;
                        if (value.type == "TriggerSmartContract") {
                            let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                            let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                            amount = idbody.raw_data.contract[0].parameter.value.amount;
                            time = idbody.raw_data.timestamp;

                            if (idbody.ret != undefined) {
                                result = idbody.ret[0].contractRet

                            } else {
                                result = "undefined"
                            }
                            let requestParams1 = { value: value.hash }

                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {



                                    let blockNumber;
                                    let contract_address;
                                    let fee = ""

                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = ""
                                    } else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contract_address;
                                        fee = infobody.receipt.net_usage,
                                            result = infobody.receipt.result;
                                        time = infobody.blockTimeStamp


                                    } let exactfee = fee / 1000000
                                    let object = {
                                        'user_id': value.transferList,
                                        'amount': amount,
                                        'transhash': value.hash,
                                        // 'buyCurrency': "CHIN",
                                        // 'paymentCurrency': "",
                                        // 'depositType': 0,
                                        'status': 1,
                                        "approvehash": value.hash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": +exactfee,
                                        "owner_address": owner_address,
                                        "Transfer_type": "TriggerSmartContract",
                                        "to_address": to_address

                                    }

                                    transactionList.updateOne({ '_id': value._id }, { $set: object }, async function (err, resData) {
                                        if (!err) {

                                            callback(resData)
                                        } else {

                                        }

                                    })


                                })
                        }
                    })
                }

                else if (value.type == "FreezeBalanceContract") {
                    let requestParams = { value: value.hash };
                    // console.log(value,"vale")


                    Request({
                        url: contractURL + "/gettransactionbyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (iderror, idresponse, idbody) {
                        // console.log(idbody,"idbody")
                        // let type = idbody.raw_data.contract[0].type; 
                        let amount;
                        let time;
                        let result;
                        // if (type == "FreezeBalanceContract") {

                        let requestParams1 = { value: value.hash }

                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {

                                // console.log(infobody,"infobody")

                                let blockNumber;
                                let contract_address;

                                let fee;

                                if (Object.keys(infobody).length === 0) {
                                    blockNumber = "",
                                        contract_address = "",
                                        result = "undefined",
                                        time = "",
                                        fee = "";
                                } else {
                                    blockNumber = infobody.blockNumber,
                                        contract_address = infobody.contract_address;
                                    fee = parseFloat(infobody.receipt.net_usage)
                                    result = infobody.receipt.result;
                                    time = infobody.blockTimeStamp


                                }
                                let exactfee = fee / 1000000
                                // console.log(exactfee,"--------------->exactfee");
                                let object = {
                                    'user_id': value.transferList,
                                    // 'amount': amount,
                                    'transhash': value.hash,
                                    'from': "ChinTwo",
                                    // 'paymentCurrency': "",
                                    // 'depositType': 0,
                                    'status': 1,
                                    "approvehash": value.hash,
                                    "blockNumber": blockNumber,
                                    "contract_address": contract_address,
                                    "result": result,
                                    "time": time,
                                    "fee": +exactfee,
                                    // "owner_address": owner_address,
                                    "type": "staking",
                                    // "to_address": to_address

                                }
                                // console.log(object,"----------------------->obj")

                                transactionList.updateOne({ '_id': value._id }, { $set: object }, async function (err, resData) {
                                    if (!err) {

                                        callback(resData)
                                    } else {

                                    }

                                })


                            })
                        // }
                    })
                }

            } catch (e) {

                callback({ status: false, response: e })

            }
            break;
        //fiat deposit/withdraw -- Coin
        case "bankdeposit":
            try {
                let asset = value.asset;
                let amount = value.amount

                //coin transaction

                let getsData = { user_name: 1, ac_status: 1, kyc_status: 1, address: 1, _id: 0, hexAddress: 1, address: 1 }

                var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(value.userId) }, getsData);

                if (asset == "ChinTwo") {

                    let depositAmt = amountConvert(amount, 6, "towei")

                    if (validUser) {
                        if (validUser.kyc_status == 1) {


                            let requestParams = { "owner_address": ownerAddress, "to_address": validUser.hexAddress, "amount": +depositAmt };

                            await Request({

                                url: contractURL + "/createtransaction",
                                method: "POST",
                                json: true,
                                body: requestParams
                            },
                                async function (error, response, body) {

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

                                                if (!signBody.Error) {

                                                    await Request({

                                                        url: contractURL + "/broadcasttransaction",
                                                        method: "POST",
                                                        json: true,
                                                        body: signBody

                                                    }, async function (broadCastError, broadCastResponse, broadCastBody) {


                                                        if (!broadCastBody.Error) {

                                                            if (broadCastBody.result) {
                                                                let transhash = broadCastBody.txid;



                                                                var update = await fiatbankTbl.updateOne({ _id: value.uniqueId }, { $set: { approvehash: transhash } });




                                                                callback({ status: "true", message: "deposit done", approvehash: transhash, });




                                                            } else {
                                                                callback({ status: "false", message: "broadCast status failed" });

                                                            }

                                                        } else {
                                                            callback({ status: "false", message: "Transaction broadCast failed" });

                                                        }
                                                    })

                                                } else {
                                                    callback({ status: "false", message: "Transaction sign failed" });


                                                }
                                            })

                                        } else {
                                            callback({ status: "false", message: body.Error });

                                        }

                                    } else {
                                        callback({ status: "false", message: "Please try again later" });

                                    }
                                });

                        } else {
                            callback({ status: "false", message: "KYC is not verified" });

                        }

                    } else {
                        callback({ status: "false", message: "Invalid user ID" });

                    }
                }

            }
            catch (e) {

            }
            break;

        case "bankwithdraw":
            try {
                let asset = value.asset;
                let amount = value.amount

                //coin transaction
                var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(value.userId) });

                if (asset == "ChinTwo") {

                    let depositAmt = amountConvert(amount, 6, "towei")


                    if (validUser) {
                        if (validUser.kyc_status == 1) {
                            let requestParams = { "owner_address": validUser.hexAddress, "to_address": ownerAddress, "amount": +depositAmt, fee_limit: 1000000 };

                            await Request({

                                url: contractURL + "/createtransaction",
                                method: "POST",
                                json: true,
                                body: requestParams
                            },
                                async function (error, response, body) {

                                    if (response.statusCode === 200) {

                                        if (!body.Error) {

                                            var pvtkey1 = decrypt(validUser.endRandom)
                                            var pvtkey2 = decrypt(validUser.aceRandom)


                                            var Userpvtkey = pvtkey1 + pvtkey2

                                            let destkey = Userpvtkey.toString();


                                            let rawData = body.raw_data;
                                            let rawDataHex = body.raw_data_hex;

                                            let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': destkey }

                                            await Request({

                                                url: contractURL + "/gettransactionsign",
                                                method: "POST",
                                                json: true,
                                                body: signTransParams

                                            }, async function (signError, signResponse, signBody) {

                                                if (!signBody.Error) {

                                                    await Request({

                                                        url: contractURL + "/broadcasttransaction",
                                                        method: "POST",
                                                        json: true,
                                                        body: signBody

                                                    }, async function (broadCastError, broadCastResponse, broadCastBody) {

                                                        if (!broadCastBody.Error) {

                                                            if (broadCastBody.result) {
                                                                let transhash = broadCastBody.txid;




                                                                var update = await fiatbankTbl.updateOne({ _id: value.uniqueId }, { $set: { approvehash: transhash } });


                                                                callback({ status: "true", approvehash: transhash, message: "withdraw Done" });



                                                            } else {
                                                                callback({ status: "false", message: "broadCast status failed" });


                                                            }

                                                        } else {
                                                            callback({ status: "false", message: "Transaction broadCast failed" });

                                                        }
                                                    })

                                                } else {

                                                    callback({ status: "false", message: "Transaction sign failed" });


                                                }
                                            })

                                        } else {
                                            callback({ status: "false", message: body.Error });


                                        }

                                    } else {
                                        callback({ status: "false", message: "Please try again later" });


                                    }
                                });

                        } else {
                            callback({ status: "false", message: "KYC is not verified" });


                        }

                    } else {

                        callback({ status: "false", message: "Invalid user ID" });
                    }






                }


            }
            catch (e) {

            }
            break;

        case "transfertoken":

            var depositData = value;

            let userId3 = depositData.user_id;
            let buyCurrency2 = depositData.token;
            let depositAmt2 = depositData.amount;
            var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(userId3) });

            var pvtkey1 = decrypt(validUser.endRandom)
            var pvtkey2 = decrypt(validUser.aceRandom)
            var fromAddress = validUser.hexAddress
            var Userpvtkey = pvtkey1 + pvtkey2

            let Userpvtkey1 = Userpvtkey.toString();

            if (validUser) {
                if (validUser.kyc_status == 1) {
                    cointoken.findOne({ name: buyCurrency2 }, (err, isCoinExists) => {
                        if (!err && isCoinExists) {

                            let TokenData1 = { ...isCoinExists }._doc;

                            var tokenAddress = TokenData1.hexAddress;
                            var tokenDecimal = TokenData1.decimals

                            let requestParams = { value: tokenAddress.toString() };

                            Request({

                                url: contractURL + "/getcontract",
                                method: "POST",
                                json: true,
                                body: requestParams


                            }, async function (error, response, body) {


                                var toaddress = value.toaddress;


                                var amount = amountConvert(depositAmt2, 6, "towei")


                                const blockWeb5 = new BlockWeb(
                                    fullNode,
                                    solidityNode,
                                    eventServer,
                                    Userpvtkey1
                                );

                                var isvalidAdd = await blockWeb5.isAddress(fromAddress)


                                if (isvalidAdd == true) {

                                    let instance = await blockWeb5.contract().at(tokenAddress);


                                    let balresult = await instance["balanceOf"](tokenAddress).call();

                                    var res = await instance["transfer"](
                                        toaddress,
                                        amount.toString()
                                    ).send({ fee_limit: 1000000 });

                                    callback({ status: "true", message: "deposit done", approvehash: res });

                                } else {

                                    callback({ status: false, "Error": err, "MESSAGE": "NOT VALID ADDRESS" })
                                }

                            })

                        } else {
                            callback({ status: false, "Error": err, "MESSAGE": "token Not exist" })
                        }
                    })
                } else {

                    callback({ status: false, message: "KYC is not verified" });
                }

            } else {

                callback({ status: false, message: "Invalid user ID" });
            }



            break;

        //fiat deposit/withdraw -- Token       
        case "bankdepositToken":

            //token transaction
            var destkey = ownerPrivateKey;

            const blockweb1 = new BlockWeb(
                fullNode,
                solidityNode,
                eventServer,
                destkey
            );

            let userId2 = value.userId;
            let buyCurrency = value.asset;
            let depositAmt = value.amount;
            console.log(value, "---------------------------");
            var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(userId2) });

            if (validUser) {
                if (validUser.kyc_status == 1) {

                    cointoken.findOne({ name: buyCurrency }, (err, isCoinExists) => {

                        if (!err && isCoinExists) {
                            let TokenData = { ...isCoinExists }._doc;
                            var tokenAddress = TokenData.hexAddress;

                            var tokenDecimal = TokenData.decimals

                            let requestParams = { value: tokenAddress };
                            Request({

                                url: contractURL + "/getcontract",
                                method: "POST",
                                json: true,
                                body: requestParams

                            }, async function (error, response, body) {

                                var toaddress = validUser.hexAddress;
                                var amount = amountConvert(depositAmt, 6, "towei")

                                var destkey = ownerPrivateKey;
                                var isvalidAdd = await blockweb1.isAddress(toaddress)

                                if (isvalidAdd == true) {
                                    let instance = await blockweb1.contract().at(tokenAddress);
                                    var mintinResponse1 = await instance["mint"](
                                        toaddress,
                                        amount.toString()
                                    ).send({ fee_limit: 1000000 });


                                    setTimeout(() => {
                                        var requestParams1 = { "value": mintinResponse1 }
                                        console.log(requestParams1, "requestParams1")

                                        Request({
                                            url: contractURL + "/gettransactioninfobyid",
                                            method: "POST",
                                            json: true,
                                            body: requestParams1

                                        }, async function (iderror, idresponse, idbody) {

                                            console.log(idbody, "idbody222");
                                            if (idbody.receipt.result != undefined) {
                                                if (idbody.receipt.result == "SUCCESS") {

                                                    // var update = await depositTbl.updateOne({ _id: depositID }, { $set: { approvehash: mintinResponse1, status: 1 } });
                                                    // console.log(update,"update");
                                                    // callback({ status: true, message: "deposite done", approvehash: mintinResponse1 });

                                                    var update = await fiatList.updateOne({ _id: value.uniqueId }, { $set: { approvehash: mintinResponse1 } });
                                                    if (update) {
                                                        console.log(depositAmt, "depositAmt")
                                                        var MintedCoins = TokenData.totalSupply + (+depositAmt)
                                                        console.log(TokenData.totalSupply, "TokenData.totalSupply")
                                                        console.log(depositAmt, "depositAmt")
                                                        console.log(MintedCoins, "MintedCoins")
                                                        var update2 = await cointoken.updateOne({ name: buyCurrency }, { $set: { 'totalSupply': +MintedCoins.toFixed(5) } })
                                                        console.log(MintedCoins.toFixed(5), "------------------>tofixed");
                                                        console.log(update, "update");
                                                        console.log(update2, "u------------pdate");





                                                        callback({ status: "true", message: "(token)deposit done", approvehash: mintinResponse1 })


                                                    } else {
                                                        callback({ status: false, message: " Failed to update" });
                                                    }
                                                }
                                                else {
                                                    callback({ status: false, message: "Failed to mint" });

                                                    console.log("unable to mint")
                                                }
                                            } else {
                                                callback({ status: false, message: "Error Occur unable to mint" });

                                            }


                                        })

                                    }, 8000)

                                        ;

                                } else {

                                    response = { status: false, "Error": err, "MESSAGE": "NOT VALID ADDRESS" };
                                }
                            })

                        } else {

                        }

                    })
                } else {

                    res.json({ status: false, message: "KYC is not verified" });
                }

            } else {

                res.json({ status: false, message: "Invalid user ID" });
            }


            break;

        case "bankWithdrawToken":
            //token transaction
            var destkey = ownerPrivateKey;

            const blockwebOwner = new BlockWeb(
                fullNode,
                solidityNode,
                eventServer,
                destkey
            );

            try {
                var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(value.userId) });
                var pvtkey1 = decrypt(validUser.endRandom)
                var pvtkey2 = decrypt(validUser.aceRandom)
                var Userpvtkey = pvtkey1 + pvtkey2
                let destkey1 = Userpvtkey.toString();

                const blockweb5 = new BlockWeb(
                    fullNode,
                    solidityNode,
                    eventServer,
                    destkey1
                );

                let userId3 = value.userId;
                let buyCurrency2 = value.asset;
                let depositAmt2 = value.amount;

                let getsData = { user_name: 1, ac_status: 1, kyc_status: 1, _id: 0, hexAddress: 1, address: 1 }

                var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(userId3) }, getsData);


                if (validUser) {
                    if (validUser.kyc_status == 1) {

                        cointoken.findOne({ name: buyCurrency2 }, (err, isCoinExists) => {

                            if (!err && isCoinExists) {
                                let TokenData = { ...isCoinExists }._doc;
                                var tokenAddress = TokenData.hexAddress;
                                var tokenDecimal = TokenData.decimals

                                let requestParams = { value: tokenAddress };
                                Request({

                                    url: contractURL + "/getcontract",
                                    method: "POST",
                                    json: true,
                                    body: requestParams


                                }, async function (error, response, body) {

                                    var toaddress = validUser.hexAddress;

                                    var amount = amountConvert(depositAmt2, 6, "towei")

                                    var destkey = ownerPrivateKey;


                                    var isvalidAdd = await blockwebOwner.isAddress(toaddress)
                                    if (isvalidAdd == true) {

                                        let instance = await blockwebOwner.contract().at(tokenAddress);
                                        var burnRes = await instance["burn"](
                                            toaddress,
                                            amount.toString()
                                        ).send({ fee_limit: 1000000 });

                                        setTimeout(() => {
                                            var requestParams1 = { "value": burnRes }
                                            console.log(requestParams1, "requestParams1")

                                            Request({
                                                url: contractURL + "/gettransactioninfobyid",
                                                method: "POST",
                                                json: true,
                                                body: requestParams1

                                            }, async function (iderror, idresponse, idbody) {

                                                console.log(idbody, "idbody222");
                                                if (idbody.receipt.result != undefined) {


                                                    if (idbody.receipt.result == "SUCCESS") {

                                                        // var update = await depositTbl.updateOne({ _id: depositID }, { $set: { approvehash: mintinResponse1, status: 1 } });
                                                        // console.log(update,"update");
                                                        // callback({ status: true, message: "deposite done", approvehash: mintinResponse1 });

                                                        var update = await fiatList.updateOne({ _id: value.uniqueId }, { $set: { approvehash: burnRes } });


                                                        if (update) {
                                                            var burnedCoins = TokenData.burnedCoins + (+depositAmt2)
                                                            console.log(TokenData.burnedCoins, "TokenData.burnedCoins")
                                                            console.log(depositAmt2, "depositAmt2")
                                                            console.log(burnedCoins, "burnedCoins")
                                                            var update2 = await cointoken.updateOne({ name: buyCurrency2 }, { $set: { 'burnedCoins': +burnedCoins } })
                                                            console.log(update2, "u------------pdate");

                                                            callback({ status: true, resData: update });
                                                        } else {
                                                            console.log("Error while updating")
                                                        }






                                                        callback({ status: "true", message: "withdraw token done", approvehash: burnRes });



                                                    } else {
                                                        callback({ status: false, message: "Failed   to mint" });

                                                        console.log("unable to mint")
                                                    }
                                                }
                                                else {
                                                    callback({ status: false, message: "Error Occur unable to mint" });

                                                    console.log("unable to mint")
                                                }


                                            })

                                        }, 5000)


                                    } else {

                                        response = { status: false, "Error": err, "MESSAGE": "NOT VALID ADDRESS" };
                                    }

                                })

                            } else {

                            }

                        })
                    } else {

                        res.json({ status: false, message: "KYC is not verified" });
                    }

                } else {

                    res.json({ status: false, message: "Invalid user ID" });
                }

            } catch (e) {

            }
            break;

        case "getNodeInfo":

            isConnected()
            async function isConnected() {

                const blockweb1 = new BlockWeb(
                    fullNode,
                    solidityNode,
                    eventServer,

                );
                const isConnected = await blockweb1.isConnected()
                callback({ status: true, isConnected: isConnected })
            }
            break;

        case "txforStake":

            try {
                let checkExist = await stakeToken.findOne({ _id: value._id })


                let requestParams = { value: value.hash }
                console.log(requestParams, "requestParams");

                Request({

                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {

                    let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                    let to_address = idbody.raw_data.contract[0].parameter.value.to_address


                    let type = idbody.raw_data.contract[0].type;
                    if (type == "FreezeBalanceContract") {
                        let result;
                        let requestParams = { value: value.hash }
                        console.log(requestParams, "requestParams")
                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {
                                let blockNumber;
                                let contract_address;

                                let time;
                                let fee
                                console.log("infobody", infobody)
                                if (Object.keys(infobody).length === 0) {
                                    blockNumber = "",
                                        contract_address = "",
                                        result = "undefined",
                                        time = "",
                                        fee = "";
                                } else {
                                    blockNumber = infobody.blockNumber,
                                        contract_address = infobody.contract_address,
                                        result = infobody.receipt.result,
                                        time = infobody.blockTimeStamp,
                                        fee = infobody.receipt.net_usage;
                                }
                                let exactfee = fee / 1000000
                                let exactAmt = checkExist.amount / 1000000
                                let object = {
                                    'user_id': checkExist.userId,
                                    'amount': +checkExist.amount,

                                    "approvehash": checkExist.hash,
                                    "blockNumber": blockNumber,
                                    "contract_address": contract_address,
                                    "result": result,
                                    "time": time,
                                    "fee": +exactfee,
                                    "owner_address": owner_address,
                                    "Transfer_type": type,
                                    "to_address": " ",
                                    "type": "Freeze"

                                }
                                console.log(object, "obj")
                                transactionList.create(object, async function (err, resData) {
                                    if (!err) {

                                        callback({ status: true, msg: "stacking detail successfully", resData: resData })
                                    } else {
                                        callback({ status: true, msg: "Unable to store data in trns list", resData: resData })

                                    }

                                })


                            })
                    }


                })







            } catch (e) {
                callback({ status: true, msg: "Unable to store data in trns list", resData: e })

            }
            break;
        case "txforUnStake":

            try {
                let checkExist = await stakeToken.findOne({ _id: value._id })


                let requestParams = { value: value.hash }


                Request({

                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    // let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                    // let to_address = idbody.raw_data.contract[0].parameter.value.to_address


                    // let type = idbody.raw_data.contract[0].type;
                    // if (type == "FreezeBalanceContract") {
                    let result;
                    let requestParams = { value: value.hash }
                    Request({

                        url: contractURL + "/gettransactioninfobyid",
                        method: "POST",
                        json: true,
                        body: requestParams

                    },
                        async function (infoerror, inforesponse, infobody) {
                            let blockNumber;
                            let contract_address;

                            let time;
                            let fee
                            if (Object.keys(infobody).length === 0) {
                                blockNumber = "",
                                    contract_address = "",
                                    result = "undefined",
                                    time = "",
                                    fee = "";
                            } else {
                                blockNumber = infobody.blockNumber,
                                    contract_address = infobody.contract_address,
                                    result = infobody.receipt.result,
                                    time = infobody.blockTimeStamp,
                                    fee = infobody.receipt.net_usage;
                            }


                            let exactfee = fee / 1000000;
                            let object = {
                                'user_id': checkExist.userId,
                                'amount': +checkExist.amount,

                                "approvehash": checkExist.hash,
                                "blockNumber": blockNumber,
                                "contract_address": contract_address,
                                "result": result,
                                "time": time,
                                "fee": exactfee,
                                "owner_address": checkExist.hexAddress,
                                "Transfer_type": "FreezeBalanceContract",
                                "type": "Un-Freeze"


                            }
                            transactionList.create(object, async function (err, resData) {
                                if (!err) {

                                    callback({ status: true, msg: "unstacking detail successfully", resData: resData })
                                } else {
                                    callback({ status: true, msg: "Unable to store data in trns list", resData: resData })

                                }

                            })


                        })
                    // }


                })







            } catch (e) {
                callback({ status: true, msg: "Unable to store data in trns list", resData: e })

            }
            break;


        case "txforTokendep":

            try {
                console.log(value, "value")



                let requestParams = { value: value.hash }


                Request({

                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {

                    let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                    let contractAddress = idbody.contract_address;


                    let type = idbody.raw_data.contract[0].type;
                    if (type == "CreateSmartContract") {
                        let requestParams = { value: value.hash }
                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {
                                let blockNumber;
                                let contract_address;
                                let result;
                                let time;
                                let fee
                                if (Object.keys(infobody).length === 0) {
                                    console.log("infobody length 0")
                                    blockNumber = "",
                                        // contract_address = "",
                                        result = "undefined",
                                        time = "",
                                        fee = "";
                                } else {
                                    blockNumber = infobody.blockNumber,
                                        contract_address = infobody.contract_address,
                                        result = infobody.receipt.result,
                                        time = infobody.blockTimeStamp,
                                        fee = infobody.receipt.net_fee;
                                }


                                let exactfee = fee / 1000000;
                                let object = {
                                    'user_id': value.userId,

                                    "tokenName": value.name,
                                    "tokenSymbol": value.symbol,
                                    "tokenDecimals": value.decimals,


                                    "approvehash": value.hash,
                                    "blockNumber": blockNumber,
                                    "contract_address": contractAddress,
                                    "result": result,
                                    "time": time,
                                    "fee": exactfee,
                                    "owner_address": owner_address,
                                    "Transfer_type": type,
                                    "type": "Token Deployment"


                                }
                                console.log(object, "obj")
                                transactionList.create(object, async function (err, resData) {
                                    if (!err) {
                                        console.log(resData, "resData")

                                        callback({ status: true, msg: "Your fiat deposit (coin) has been submitted successfully", resData: resData })
                                    } else {
                                        callback({ status: true, msg: "Unable to store data in trns list", resData: resData })

                                    }

                                })


                            })
                    }


                })







            } catch (e) {
                callback({ status: true, msg: "Unable to store data in trns list", resData: e })

            }

        case "txforProposal":
            try {
                let requestParams = { value: value.hash };
                Request({
                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    let type = idbody.raw_data.contract[0].type;
                    let amount;
                    let time;
                    let result;

                    if (type == "TransferContract") {
                        let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                        console.log("owner_address", owner_address)
                        let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                        console.log("to_address", to_address)

                        amount = idbody.raw_data.contract[0].parameter.value.amount;
                        console.log("amt", amount)

                        time = idbody.raw_data.timestamp;
                        console.log("time", time)

                        divAmount = amountConvert(amount, 6, "fromwei")
                        console.log("divAmount", divAmount)


                        if (idbody.ret != undefined) {
                            result = idbody.ret[0].contractRet

                        } else {
                            result = "undefined"
                        }
                        let requestParams = { value: hash }
                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {
                                let blockNumber;
                                let contract_address;
                                let fee = ""

                                let object = {
                                    'user_id': value.user_id,
                                    'amount': amount,
                                    'transhash': value.hash,
                                    'sendCurrency': "CHIN",
                                    'paymentCurrency': "",
                                    'depositType': 0,
                                    'status': 1,
                                    "approvehash": value.hash,
                                    "blockNumber": blockNumber,
                                    "contract_address": contract_address,
                                    "result": result,
                                    "time": time,
                                    "fee": fee,
                                    "owner_address": owner_address,
                                    "Transfer_type": type,
                                    "to_address": to_address

                                }
                                console.log("obj coin transfr", object)
                                transactionList.create(object, async function (err, resData) {
                                    if (!err) {
                                        callback({ status: true, resData: resData })
                                    } else {
                                        callback({ status: false, msg: err });
                                    }
                                })
                            })
                    }

                })



            } catch (e) {

                res.json(e)
            }
            break;

        case "gettranxInfo":

            var txid = '9dc4efbc7181d9fefc9a57beeacf3a915ea6e030cb498b2ad274d5d531bc4875';
            getTransactionInfo();
            var destkey5 = "670eb6d10ed122184730c82f1e65c74ddcc320f77bb4c8fd174a167ce00a6d55";
            async function getTransactionInfo() {
                const blockweb25 = new BlockWeb(
                    fullNode,
                    solidityNode,
                    eventServer,
                    destkey5
                );
                await blockweb25.transactionBuilder.getTransactionInfo(txid, (err, getTransactionInfo) => {
                    if (err) {
                        response = { status: false, "Error_detail": err };
                    } else {
                        response = { status: true, Transaction_Details: getTransactionInfo };
                    }
                    callback(response);
                });
            }
            break;

        case "txforp2p":
            var orderType = value.orderType;
            var userId22 = value.userId2;
            console.log(value, "value")


            var getToAddr = await user.findOne({ "_id": userId22 });
            console.log(getToAddr, "getToAddr")
            if (value.type == "tokenTransfer") {


                let requestParams = { value: value.approvehash }
                console.log(requestParams, "requestParams")
                Request({
                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    console.log(idbody, "idbody tok")
                    let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;


                    let type = idbody.raw_data.contract[0].type;
                    if (type == "TriggerSmartContract") {
                        let requestParams = { value: value.approvehash }
                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {
                                console.log(infobody, "infobody")
                                let blockNumber;
                                let contract_address;
                                let result;
                                let time;
                                let fee;
                                if (Object.keys(infobody).length === 0) {
                                    blockNumber = "",
                                        contract_address = "",
                                        result = "undefined",
                                        time = "",
                                        fee = "null";
                                } else {
                                    blockNumber = infobody.blockNumber,
                                        contract_address = infobody.contract_address,
                                        result = infobody.receipt.result,
                                        time = infobody.blockTimeStamp,
                                        fee = infobody.receipt.net_fee
                                }
                                let object = {};
                                console.log(orderType, "condn")
                                console.log(infobody.receipt, "infobody.receipt")
                                if (orderType == "sell") {

                                    object = {
                                        'user_id': value.userId2,
                                        'amount': +value.amount, 'orderType': "sell",
                                        'from': value.currencyName,
                                        'to': value.toCurrency,
                                        'status': 1,
                                        "approvehash": value.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": getToAddr.hexAddress,
                                        "Transfer_type": type,
                                        "to_address": ownerAddress

                                    }
                                } else {
                                    object = {
                                        'user_id': value.userId2,
                                        'amount': +value.amount,
                                        'orderType': "buy",
                                        'from': value.currencyName,
                                        'to': value.toCurrency,
                                        'status': 1,
                                        "approvehash": value.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": getToAddr.hexAddress
                                    }
                                }
                                console.log(object, "obj tkn sell")
                                transactionList.create(object, async function (err, resData) {
                                    if (!err) {
                                        console.log("created", resData)
                                        callback({ status: true, resData: resData })
                                    } else {
                                        console.log(err, "err")
                                        callback({ status: false, message: err })


                                    }

                                })


                            })
                    }
                })

            } else if (value.type == "coinTransfer") {
                let requestParams = { value: value.approvehash };

                Request({
                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    console.log(idbody, "idbody coin")
                    let type = idbody.raw_data.contract[0].type;
                    let amount;
                    let time;
                    let result;
                    if (type == "TransferContract") {
                        let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                        let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                        amount = idbody.raw_data.contract[0].parameter.value.amount;
                        time = idbody.raw_data.timestamp;


                        if (idbody.ret != undefined) {
                            result = idbody.ret[0].contractRet

                        } else {
                            result = "undefined"
                        }
                        let requestParams = { value: value.approvehash }
                        console.log(requestParams, "requestParams")
                        Request({

                            url: contractURL + "/gettransactioninfobyid",
                            method: "POST",
                            json: true,
                            body: requestParams

                        },
                            async function (infoerror, inforesponse, infobody) {
                                console.log(infobody, "infobody coin")

                                let blockNumber;
                                let contract_address;
                                let fee;


                                if (Object.keys(infobody).length === 0) {
                                    blockNumber = "",
                                        contract_address = ""
                                } else {
                                    blockNumber = infobody.blockNumber,
                                        contract_address = infobody.contractResult
                                    fee = infobody.receipt.net_fee
                                }
                                console.log(infobody.receipt, "infobody.receipt")
                                console.log(infobody.contractResult, "infobody.contractResult")

                                let object = {};
                                console.log(orderType, "condn")
                                if (orderType == "sell") {

                                    object = {
                                        'user_id': value.userId,
                                        'amount': +value.amount, 'orderType': "sell",
                                        'to': value.toCurrency,
                                        'from': value.currencyName,
                                        'status': 1,
                                        "approvehash": value.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": to_address,
                                        "Transfer_type": type,
                                        "to_address": owner_address

                                    }
                                } else {
                                    object = {
                                        'user_id': value.userId,
                                        'amount': +value.amount, 'orderType': "buy",
                                        'from': value.fromCurrency,
                                        'to': value.toCurrency,
                                        'status': 1,
                                        "approvehash": value.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": fee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": to_address
                                    }
                                }
                                console.log(object)
                                transactionList.create(object, async function (err, resData) {
                                    if (!err) {
                                        console.log("credstd")
                                        callback({ status: true, resData: resData })
                                    } else {
                                        console.log(err)
                                        callback({ status: false, message: err })
                                    }
                                })


                            })
                    }
                })

            }
            break;

        case "txfordeposit":
            console.log(value, "balue");
            var depositID = value.id;
            let checkExist = await stripeTbl.findOne({ _id: depositID })
            var getToAddr = await user.findOne({ _id: checkExist.userId });
            console.log(checkExist, "checkExist");
            console.log(getToAddr, "getToAddr");

            if (value.type == "coinTransfer") {
                let requestParams = { value: checkExist.approvehash };

                Request({
                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    console.log(idbody, "idbody");
                    let type = idbody.raw_data.contract[0].type;
                    let amount;
                    let time;
                    let result;
                    if (type == "TransferContract") {
                        let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;
                        let to_address = idbody.raw_data.contract[0].parameter.value.to_address;
                        amount = idbody.raw_data.contract[0].parameter.value.amount;
                        time = idbody.raw_data.timestamp;


                        if (idbody.ret != undefined) {
                            result = idbody.ret[0].contractRet

                        } else {
                            result = "undefined"
                        }
                        let requestParams = { value: checkExist.approvehash }
                        setTimeout(function () {
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    console.log(infobody, "infobody");
                                    let blockNumber;
                                    let contract_address;


                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = ""
                                    } else if (infobody.receipt.net_usage == undefined) {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_fee;
                                        // result = infobody.receipt.result;

                                    }

                                    else {
                                        blockNumber = infobody.blockNumber,

                                            contract_address = infobody.contractResult;
                                        fee = infobody.receipt.net_usage,
                                            // result = infobody.receipt.result;
                                            time = infobody.blockTimeStamp

                                    }
                                    let exactfee = +fee / 1000000;
                                    let object = {
                                        'user_id': checkExist.userId,
                                        'amount': +checkExist.amount / 100,
                                        // 'transhash': checkExist.approvehash,
                                        'from': checkExist.buyCurrency,
                                        'to': checkExist.currency,
                                        "buyAmount": checkExist.buyAmount,
                                        'type': "Stripe",
                                        'status': 1,
                                        "approvehash": checkExist.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": +exactfee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": to_address,
                                        "type": "Deposit (Stripe)"

                                    }
                                    console.log(object, "object");
                                    transactionList.create(object, async function (err, resData) {
                                        if (!err) {
                                            console.log(resData, "resData");
                                            console.log(err, "err");
                                            callback(resData)
                                        } else {
                                            console.log(err, "err")
                                        }

                                    })


                                })
                        }, 9000)
                    }
                })

            }
            else {
                // if (value.type == "tokenTransfer") {
                let requestParams = { value: checkExist.approvehash }
                console.log(requestParams, "requestParams");
                Request({
                    url: contractURL + "/gettransactionbyid",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (iderror, idresponse, idbody) {
                    console.log(idbody, "idbody");
                    let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;


                    let type = idbody.raw_data.contract[0].type;
                    if (type == "TriggerSmartContract") {
                        let requestParams = { value: checkExist.approvehash }

                        setTimeout(function () {
                            Request({

                                url: contractURL + "/gettransactioninfobyid",
                                method: "POST",
                                json: true,
                                body: requestParams

                            },
                                async function (infoerror, inforesponse, infobody) {
                                    let blockNumber;
                                    let contract_address;
                                    let result;
                                    let time;
                                    let fee
                                    if (Object.keys(infobody).length === 0) {
                                        blockNumber = "",
                                            contract_address = "",
                                            result = "undefined",
                                            time = "",
                                            fee = "";
                                    } else {
                                        blockNumber = infobody.blockNumber,
                                            contract_address = infobody.contract_address,
                                            result = infobody.receipt.result,
                                            time = infobody.blockTimeStamp,
                                            fee = infobody.receipt.net_fee;
                                    }
                                    let exactfee = fee / 1000000;
                                    let object = {
                                        'user_id': checkExist.userId,
                                        'amount': +checkExist.amount / 100,
                                        // 'transhash': checkExist.transhash,
                                        'from': checkExist.buyCurrency,
                                        'to': checkExist.currency,
                                        // 'depositType': +checkExist.depositType,
                                        'status': 1,
                                        "approvehash": checkExist.approvehash,
                                        "blockNumber": blockNumber,
                                        "contract_address": contract_address,
                                        "result": result,
                                        "time": time,
                                        "fee": +exactfee,
                                        "owner_address": owner_address,
                                        "Transfer_type": type,
                                        "to_address": getToAddr.hexAddress,
                                        "type": "Deposit"


                                    }
                                    console.log(object, "object");
                                    transactionList.create(object, async function (err, resData) {
                                        if (!err && resData) {
                                            console.log(resData, "resData");
                                            cointoken.findOne({ name: checkExist.buyCurrency }, async (err, isCoinExists) => {
                                                console.log("-------------------> ~ err", err)
                                                console.log("-------------------> ~ isCoinExists", isCoinExists)

                                                var totalSupply = isCoinExists.totalSupply + (+checkExist.buyAmount)
                                                console.log(isCoinExists.totalSupply, "isCoinExists.totalSupply")
                                                console.log(checkExist.buyAmount, "depositAmt2")
                                                console.log(totalSupply, "totalSupply")
                                                var update2 = await cointoken.updateOne({ name: checkExist.buyCurrency }, { $set: { 'totalSupply': +totalSupply } })
                                                console.log(update2, "u------------pdate");

                                                // callback({ status: true, resData: update });
                                                callback(resData)
                                            })

                                        } else {
                                            console.log("err wshile creating", err);

                                        }
                                    })


                                })
                        }, 9000)
                    }
                })

                // }
            }
            break;

        default:
            callback(1)
            break;
    }
}

var destkey = "a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b"

const blockweb1 = new BlockWeb(
    fullNode,
    solidityNode,
    eventServer,
    destkey
);


exports.proposal = function (method, value, callback) {
    var response;
    let ownerAddress = "1c40129e8e93661724452426af53273930403551ea";
    switch (method) {

        case "applyForSR":
            try {
                console.log('value --->', value)
                var address = value.address;
                var destKey = value.destkey;
                var srurl = value.url;
                var url = contractURL + '/createwitness';
                var url1 = contractURL + '/gettransactionsign';
                var url2 = contractURL + '/broadcasttransaction';
                // console.log('srurl -->',srurl);
                // console.log('toHex -->',hex(srurl));
                // return;
                var addr = address.toString();
                var uurl = hex(srurl)
                var datat = { "owner_address": addr, "url": uurl };
                // var datat = '{ "owner_address":"' +address+'", "url":"'+hex(srurl)+'" }';
                // "7777772e746573742e636f6d" };
                console.log('datat -->', datat);
                console.log('contractURL -->', contractURL());


                Request({

                    url: contractURL() + "/createwitness",
                    method: "POST",
                    json: true,
                    body: datat

                }, async function (createError, createResponse, createBody) {
                    console.log(createError, "createError");
                    console.log(createBody, "createBody");
                    if (!createBody.Error) {

                        let signTransParams = { 'transaction': { "raw_data": createBody.raw_data, "raw_data_hex": createBody.raw_data_hex }, 'privateKey': destKey }
                        console.log(signTransParams, "signTransParams");
                        Request({

                            url: contractURL() + "/gettransactionsign",
                            method: "POST",
                            json: true,
                            body: signTransParams

                        }, async function (signError, signResponse, signBody) {
                            console.log(signBody, "signBody")
                            console.log(signError, "signError")
                            if (!signBody.Error) {

                                Request({

                                    url: contractURL() + "/broadcasttransaction",
                                    method: "POST",
                                    json: true,
                                    body: signBody

                                }, async function (broadCastError, broadCastResponse, broadCastBody) {

                                    console.log(broadCastBody, "broadCastBody")
                                    console.log(broadCastError, "broadCastError")
                                    if (!broadCastBody.Error) {

                                        if (broadCastBody.result) {
                                            // let transhash = broadCastBody.txid;
                                            let transhash = broadCastBody.txid;

                                            setTimeout(() => {
                                                console.log(transhash, "__________----transhash");
                                                let requestParams = { value: transhash }
                                                Request({
                                                    url: contractURL() + "/gettransactionbyid",
                                                    method: "POST",
                                                    json: true,
                                                    body: requestParams

                                                }, async function (iderror, idresponse, idbody) {
                                                    log
                                                    console.log(idbody, "idbody coin")
                                                    let type = idbody.raw_data.contract[0].type;
                                                    let amount;
                                                    let time;
                                                    let result;
                                                    let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;

                                                    time = idbody.raw_data.timestamp;


                                                    if (idbody.ret != undefined) {
                                                        result = idbody.ret[0].contractRet

                                                    } else {
                                                        result = "undefined"
                                                    }
                                                    console.log(transhash, "-----transhash--------")
                                                    let requestParams = { value: transhash }

                                                    Request({

                                                        url: contractURL() + "/gettransactioninfobyid",
                                                        method: "POST",
                                                        json: true,
                                                        body: requestParams

                                                    },
                                                        async function (infoerror, inforesponse, infobody) {
                                                            console.log(infobody, "infobody SR")

                                                            let blockNumber;
                                                            let contract_address;
                                                            let fee;


                                                            if (Object.keys(infobody).length === 0) {
                                                                blockNumber = "",
                                                                    contract_address = ""
                                                            } else {
                                                                blockNumber = infobody.blockNumber,
                                                                    contract_address = infobody.contractResult
                                                                fee = infobody.receipt.net_usage
                                                            }
                                                            console.log(infobody.receipt, "infobody.receipt")
                                                            console.log(infobody.contractResult, "infobody.contractResult")

                                                            let exactfee = +fee / 1000000
                                                            object = {
                                                                'user_id': value.userId,
                                                                'amount': +value.amount,
                                                                'from': value.fromCurrency,
                                                                'to': value.toCurrency,
                                                                'status': 1,
                                                                "approvehash": value.approvehash,
                                                                "blockNumber": blockNumber,
                                                                "contract_address": contract_address,
                                                                "result": result,
                                                                "time": time,
                                                                "fee": +exactfee,
                                                                "owner_address": owner_address,
                                                                "Transfer_type": type,
                                                                "to_address": ownerAddress
                                                            }

                                                            console.log(object)
                                                            transactionList.create(object, async function (err, resData) {
                                                                if (!err) {
                                                                    console.log("--------------------------credstd")
                                                                    // callback({ status: true, resData: resData } )
                                                                    callback({ status: true, message: " done", txid: transhash, });

                                                                } else {
                                                                    console.log(err)
                                                                    callback({ status: false, message: err })
                                                                }
                                                            })


                                                        })

                                                })

                                            }, 9000)








                                        } else {
                                            callback({ status: "false", message: "broadCast status failed" });
                                        }

                                    } else {
                                        callback({ status: "false", message: "Transaction broadCast failed" });

                                    }
                                })

                            } else {
                                callback({ status: "false", message: "Transaction sign failed" });


                            }
                        })

                    } else {
                        var resp = createBody.Error.replace("tron", "cii");

                        callback({ status: "false", message: resp });
                    }
                })


            } catch (e) {
                response = { status: false, Error: e };
                callback(response);
            }
            break;

        case "voteSR":
            try {
                var url = contractURL() + '/votewitnessaccount';
                var url1 = contractURL() + '/gettransactionsign';
                var url2 = contractURL() + '/broadcasttransaction';
                console.log(value, "val");
                console.log(url, "url");
                let srAdd = value.params.address;
                let voteCount = value.params.vote;
                console.log(srAdd, "srAdd");
                console.log(voteCount, "voteCount");

                // //   if(Object.keys(srAdd).length == 0){
                //     response = {status:false, Error :"Please Select Your Voters"};
                //             // console.log('Vote RES -->',response);
                //     callback(response);
                // //   }

                //   let srkey = Object.keys(srAdd);
                //   let srval = Object.values(srAdd);

                let srdata = [({ "vote_address": srAdd, "vote_count": voteCount })];
                console.log(srdata, "srdatasrdata");

                //   for(var j=0;j<=srkey.length;j++){
                //     if(srkey[j] != undefined){
                //     //   srdata.push({"vote_address":lgcyWeb.address.toHex(srkey[j]),"vote_count":+srval[j]});
                //       srdata.push({"vote_address":srkey[j],"vote_count":+srval[j]});
                //     }
                //   }


                //   var datat = '{"owner_address":"'+lgcyWeb.address.toHex(value.ownAddress.toString())+'","votes":'+JSON.stringify(srdata)+'}';
                var datat = '{"owner_address":"' + value.ownAddress.toString() + '","votes":' + JSON.stringify(srdata) + '}';
                console.log(datat, "datat");
                var options = {
                    'method': 'POST',
                    'url': url,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'form': datat
                };
                Request(options, function (error, resData) {
                    console.log('Vote1 error -->', error);
                    var result = resData.body;
                    console.log('Vote1 RES -->', result);
                    if (result.Error) {
                        var res = resData.Error.replace("tron", "CII");
                        response = { status: false, Error: res };
                        callback(response);
                    }
                    if (!result.Error) {
                        resData = JSON.parse(result);
                        if (resData.raw_data) {
                            var res1 = JSON.stringify(resData.raw_data);
                            raw_data_hex = resData.raw_data_hex;
                            var rawData = '{"transaction":{"raw_data":' + res1 + ',"raw_data_hex":"' + raw_data_hex + '"},"privateKey":"' + value.pvtkey.toString() + '"}';
                            var options1 = {
                                'method': 'POST',
                                'url': url1,
                                'headers': {
                                    'Content-Type': 'application/json'
                                },
                                'form': rawData
                            };
                            Request(options1, function (error, transData) {
                                console.log(error, "error2")
                                var transRes = transData.body;
                                console.log(transRes, "transRes");
                                if (transRes) {
                                    var options2 = {
                                        'method': 'POST',
                                        'url': url2,
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        'form': transRes
                                    };
                                    Request(options2, function (error, brodData) {
                                        console.log(brodData.body, "brodData");
                                        console.log('Vote error br -->', error);


                                        setTimeout(() => {
                                            let transhash = brodData.body.txid
                                            console.log(transhash, "__________----transhash");
                                            let requestParams = { value: transhash }
                                            Request({
                                                url: contractURL() + "/gettransactionbyid",
                                                method: "POST",
                                                json: true,
                                                body: requestParams

                                            }, async function (iderror, idresponse, idbody) {
                                                log
                                                console.log(idbody, "idbody coin")
                                                let type = idbody.raw_data.contract[0].type;
                                                let amount;
                                                let time;
                                                let result;
                                                let owner_address = idbody.raw_data.contract[0].parameter.value.owner_address;

                                                time = idbody.raw_data.timestamp;
                                                if (idbody.ret != undefined) {
                                                    result = idbody.ret[0].contractRet

                                                } else {
                                                    result = "undefined"
                                                }
                                                console.log(transhash, "-----transhash--------")
                                                let requestParams = { value: transhash }

                                                Request({

                                                    url: contractURL() + "/gettransactioninfobyid",
                                                    method: "POST",
                                                    json: true,
                                                    body: requestParams

                                                },
                                                    async function (infoerror, inforesponse, infobody) {
                                                        console.log(infobody, "infobody SR")

                                                        let blockNumber;
                                                        let contract_address;
                                                        let fee;


                                                        if (Object.keys(infobody).length === 0) {
                                                            blockNumber = "",
                                                                contract_address = ""
                                                        } else {
                                                            blockNumber = infobody.blockNumber,
                                                                contract_address = infobody.contractResult
                                                            fee = infobody.receipt.net_usage
                                                        }
                                                        console.log(infobody.receipt, "infobody.receipt")
                                                        console.log(infobody.contractResult, "infobody.contractResult")

                                                        let exactfee = +fee / 1000000
                                                        object = {
                                                            'user_id': value.userId,

                                                            'status': 1,
                                                            "approvehash": value.approvehash,
                                                            "blockNumber": blockNumber,
                                                            "contract_address": contract_address,
                                                            "result": result,
                                                            "time": time,
                                                            "fee": +exactfee,
                                                            "owner_address": owner_address,
                                                            "Transfer_type": type,
                                                            "to_address": ownerAddress
                                                        }

                                                        console.log(object)
                                                        transactionList.create(object, async function (err, resData) {
                                                            if (!err) {
                                                                console.log("--------------------------credstd")
                                                                // callback({ status: true, resData: resData } )
                                                                callback({ status: true, message: " done", txid: transhash, });

                                                            } else {
                                                                console.log(err)
                                                                callback({ status: false, message: err })
                                                            }
                                                        })


                                                    })

                                            })

                                        }, 9000)




                                        response = { status: true, result: brodData.body };
                                        // console.log('Vote RES -->',response);
                                        callback(response);
                                    });
                                }
                            })
                        } else {
                            var res = resData.Error.replace("tron", "CII");
                            response = { status: false, Error: res };
                            callback(response);
                        }
                    } else {
                        if (result.Error) {
                            var res = resData.Error.replace("tron", "CII");
                            response = { status: false, Error: res };
                        } else {
                            response = { status: false, Error: 'Please try again later' };
                        }
                        callback(response);
                    }
                })
            } catch (e) {
                response = { status: false, Error: e };
                callback(response);
            }
            break;

        case "listSuperRepresentatives":
            try {

                Request({

                    url: fullNode + "/wallet/listwitnesses",
                    method: "get",
                    json: true,
                },
                    async function (infoerror, inforesponse, infobody) {

                        console.log(infobody, "infobody")
                        console.log(infoerror, "infoerror")

                        response = { status: true, SuperRepresentative_List: infobody };
                        callback(response);

                    })

            } catch (e) {
                response = { status: false, Error: e };
                callback(response);
            }
            break;

        case "getBrokerage":
            var address = value.address;
            var url = fullNode + '/wallet/getBrokerage';
            var data = { "address": address, "visible": true };
            var options = {
                'method': 'POST',
                'url': url,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'form': data
            };
            Request(options, function (error, brodData) {
                var resData = JSON.parse(brodData.body);
                response = { status: true, result: resData.brokerage };
                // console.log('Vote response -->',response)
                callback(response);
            });
            break;

        case "getAccount":
            var address = value.address;
            var url = fullNode + '/wallet/getaccount';
            var data = { "address": address };
            var options = {
                'method': 'POST',
                'url': url,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'form': data
            };
            Request(options, function (error, brodData) {
                // console.log('Vote brodData -->',brodData)

                var resData = JSON.parse(brodData.body);
                response = { status: true };
                console.log('Vote brodData -->', resData)
                console.log('Vote brodData error -->', error)
                callback(response);
            });
            break;


        case "getaddress":
            var address = value.address;
            var getaddress = blockweb1.address.fromHex(address);
            // var getaddress1 = blockweb1.address.toHex('CM9gKhUANK1JGGTtGS9Ps8HBfYs9WyWiDK');
            // var getaddress = lgcyWeb.address.fromHex(address);
            response = { status: true, getaddress: getaddress, hexAddress: address };
            callback(response);
            break;

        default:
            callback(1)
            break;
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




var path = require('path');

var Verification = require('../VhJVEVMSVNU/RklMRSCQUNLVVA'),
    _Security = require('../QkFDSVQ/RklMRSXSElURUxJUQ');
// Authenticate = require('./alert');

module.exports._validate_origin = (req, res) => {
    if (Verification.url_list.indexOf(req.headers.origin) > -1)
        return this._validateSuccess(req)
    else
        this._errorResponse(req, res)
}

module.exports._validateResponse = (req, res) => {
    if (_Security.url_list.indexOf(req.headers.referer.substring(0, req.headers.referer.length, -1)) > -1)
        return this._validateSuccess(req)
    else
        this._errorResponse(req, res)
}

module.exports._errorResponse = async (req, res) => {
    // await Authenticate._alertMessage(req);
    res.status(401).sendFile(path.join(__dirname, '../views/error.html'))
}

module.exports._validateSuccess = (req) => {
    return true;
}

module.exports.referral = () => {
    var result = '',
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
        Length = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * Length));
    }
    return result;
}


