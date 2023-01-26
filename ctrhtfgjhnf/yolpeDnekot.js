const express = require('express');
const mongoose = require('mongoose');
const Request = require('request');
const common = require('../hprftghftgj/nommoc.js');
const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const Helper = require('../hprftghftgj/nommoc');
const contractURL = Helper.freezeBalance();
const contractURL1 = Helper.contractAddress();
const ownerAddress = Helper.ownerAddress();
const ownerPrivateKey = Helper.ownerPrivateKey();
const rp = require('request-promise')
const { body } = require('express-validator');
const stakeToken = require('../mdlhysreyh/ekastsnekot')
const userInfo = require('../mdlhysreyh/usrscdsfgesdg')
const tokenStake = require('../mdlhysreyh/ekastsnekot');
const witness = require('../mdlhysreyh/wfdueiness')
var async = require("async");
const allTokensList = require('../mdlhysreyh/tsiLnekotTlla');
const srTbl = require('../mdlhysreyh/srtbldfgvdf');
const SRdetails = require('../mdlhysreyh/srdtls');
const votesr = require('../mdlhysreyh/srvtedtls');


var proposalDB = require('../mdlhysreyh/defprdfewi')
const power = require('../mdlhysreyh/voeligiblete')
const proposalVote = require('../mdlhysreyh/vonttecou')
const siteSetting = require('../mdlhysreyh/sitstgsgfs')




exports.validateBal = (req, res, next) => {
    try {



        usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {
            let requestParams = { address: getsData.hexAddress };

            await Request({

                url: contractURL + "/getaccount",
                method: "POST",
                json: true,
                body: requestParams

            }, async function (error, response, body) {

                var bodyBalance = body.balance;


                if (bodyBalance >= 1000000) {

                    next()
                }
                else {
                    res.status(200).send({ status: false, Chin_balance: bodyBalance, 'message': 'Not enough balance is available to deploy token' })
                }
            })
        })

    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}

exports.handleFreeze = (req, res) => {
    try {

        var userId = req.userId


        let abiArr = req.body.abiArr;
        let byteCode = req.body.byteCode;
        let name = "CTWQ";


        usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {


            var hexAddress = getsData.hexAddress;
            var address = getsData.address;

            var pvtkey1 = common.decrypt(getsData.endRandom)
            var pvtkey2 = common.decrypt(getsData.aceRandom)
            var pvtkey = pvtkey1 + pvtkey2



            let requestParams = {
                "owner_address": getsData.hexAddress,
                "frozen_duration": 3,
                "resource": "ENERGY",
                "frozen_balance": 1000000
            }
            const headers = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            };

            await Request({
                url: contractURL + "/freezebalance",
                method: "POST",
                json: true,
                body: requestParams,
                headers: headers

            }, function (error, response, body) {
                if (response.statusCode == 200) {

                    const req = {
                        transaction: {
                            raw_data: body.raw_data,
                            raw_data_hex: body.raw_data_hex,
                        },
                        privateKey: pvtkey
                    };

                    Request({
                        url: contractURL + "/gettransactionsign",
                        method: "POST",
                        json: true,
                        body: req,
                        headers: headers

                    }, function (error, response, body) {
                        if (response) {



                            Request({
                                url: contractURL + "/broadcasttransaction",
                                method: "POST",
                                json: true,
                                body: body,
                                headers: headers

                            }, function (error, response, body) {
                                if (response) {
                                    let id = body.txid
                                    let transaction_id = {
                                        "value": id.toString()
                                    }


                                    setTimeout(function () {
                                        Request({
                                            url: contractURL + "/gettransactionbyid",
                                            method: "POST",
                                            json: true,
                                            body: transaction_id

                                        }, function (error, response, body) {
                                            if (response) {

                                                let deploy = {
                                                    "abi": abiArr,
                                                    "bytecode": byteCode,
                                                    "owner_address": hexAddress,
                                                    "name": name,
                                                    "fee_limit": 100000000,
                                                }

                                                Request({
                                                    url: contractURL + "/deploycontract",
                                                    method: "POST",
                                                    json: true,
                                                    body: deploy,
                                                    headers: headers

                                                }, function (error, response, body) {
                                                    if (response) {

                                                        const req1 = {
                                                            transaction: {
                                                                raw_data: body.raw_data,
                                                                raw_data_hex: body.raw_data_hex,
                                                            },
                                                            privateKey: pvtkey
                                                        };
                                                        Request({
                                                            url: contractURL + "/gettransactionsign",
                                                            method: "POST",
                                                            json: true,
                                                            body: req1,
                                                            headers: headers

                                                        }, function (error, response, body) {
                                                            if (response) {


                                                                Request({
                                                                    url: contractURL + "/broadcasttransaction",
                                                                    method: "POST",
                                                                    json: true,
                                                                    body: body,
                                                                    headers: headers

                                                                }, function (error, response, body) {
                                                                    if (response) {
                                                                        let id1 = body.txid
                                                                        let transaction_id1 = {
                                                                            "value": id1.toString()
                                                                        }




                                                                        setTimeout(function () {
                                                                            Request({
                                                                                url: contractURL + "/gettransactioninfobyid",
                                                                                method: "POST",
                                                                                json: true,
                                                                                body: transaction_id1
                                                                            }, function (error, response, body) {
                                                                                if (response) {
                                                                                    if (body.receipt.result == "SUCCESS") {

                                                                                        let contract_address = body.contract_address;
                                                                                        let tran_id = body.id;



                                                                                        let data = { hexAddress: hexAddress, destkey: pvtkey, hash: tran_id, userId: userId, tokenAddress: contract_address }


                                                                                        common.getAPI("getdetail", data, function (finalRes) {
                                                                                            if (finalRes.status) {

                                                                                                common.getAPI("txforTokendep", finalRes.resData, function (result) {
                                                                                                    if (result.status) {
                                                                                                        res.json(finalRes)
                                                                                                    }
                                                                                                })
                                                                                            } else {

                                                                                                res.json(finalRes)
                                                                                            }
                                                                                        })
                                                                                    }

                                                                                }
                                                                                else {

                                                                                    res.json({ 'status': false, 'message': 'Something went wrong' })
                                                                                }
                                                                            })
                                                                        }, 3000)
                                                                    }
                                                                })
                                                            }
                                                            else {

                                                                res.json({ 'status': false, 'message': 'Something went wrong.. Please try again later' })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                            else {

                                                res.json({ 'status': false, 'message': 'Error occurred while generating transaction id' })
                                            }
                                        }
                                        )
                                    }, 5000)
                                }
                                else {

                                    res.json({ 'status': false, 'message': 'Error occurred while broadcasting' })
                                }
                            })
                        }
                        else {

                            res.json({ 'status': false, 'message': 'Error occurred while signing transaction' })
                        }
                    })
                }
                else {

                    res.json({ 'status': false, 'message': 'Error occurred while freezing balance' })
                }



            })
        });
    }
    catch (e) {

        res.json({ 'status': false, 'message': e })
    }
}



exports.tokenDeployAmount = (req, res, next) => {
    try {
        var user_id = req.userId;
        usersTbl.findOne({ "_id": user_id }, async (err, getsData) => {
            if (getsData.Token_Deploy === false) {
                var pvtkey1 = common.decrypt(getsData.endRandom)
                var pvtkey2 = common.decrypt(getsData.aceRandom)
                var pvtkey = pvtkey1 + pvtkey2

                siteSetting.find({}, (err, siteDetails) => {
                    if (siteDetails) {
                        const deployAmt = siteDetails[0].TokenDeployFee;
                        let requestParams = { address: getsData.hexAddress };

                        Request({
                            url: contractURL + "/getaccount",
                            method: "POST",
                            json: true,
                            body: requestParams
                        }, async function (error, response, body) {

                            var bodyBalance = body.balance;

                            if (bodyBalance >= deployAmt) {
                                let requestParams = {
                                    "to_address": ownerAddress,
                                    "owner_address": getsData.hexAddress,
                                    "amount": deployAmt
                                };
                                Request({
                                    url: contractURL1 + "/createtransaction",
                                    method: "POST",
                                    json: true,
                                    body: requestParams

                                }, async function (error, response, body) {
                                    if (response.statusCode === 200) {

                                        if (!body.Error) {
                                            let rawData = body.raw_data;
                                            let rawDataHex = body.raw_data_hex;

                                            let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': pvtkey }

                                            Request({
                                                url: contractURL1 + "/gettransactionsign",
                                                method: "POST",
                                                json: true,
                                                body: signTransParams

                                            }, async function (signError, signResponse, signBody) {

                                                if (!signBody.Error) {
                                                    Request({
                                                        url: contractURL1 + "/broadcasttransaction",
                                                        method: "POST",
                                                        json: true,
                                                        body: signBody

                                                    }, async function (broadCastError, broadCastResponse, broadCastBody) {

                                                        if (!broadCastBody.Error) {

                                                            if (broadCastBody.result) {



                                                                usersTbl.updateOne({ "_id": user_id }, {
                                                                    "$set": {
                                                                        "Token_Deploy": true
                                                                    }
                                                                }, (err, updated) => { })

                                                                const reqParams = { "hash": broadCastBody.txid, "user_id": user_id }
                                                                common.getAPI("txforProposal", reqParams, function (finalResult) {
                                                                    if (finalResult) {
                                                                        var res = finalResult;
                                                                        next()
                                                                    }
                                                                    else {
                                                                        console.log("errrrr")
                                                                    }
                                                                })


                                                            } else {

                                                                return res.json({ status: false, message: 'Broadcast status failed' });
                                                            }

                                                        } else {

                                                            return res.json({ status: false, message: 'Transaction broadcast failed' });
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
                            }
                            else {
                                res.json({ 'status': false, 'message': 'Your Chin Two amount is less than token deployment fee' })
                            }
                        })

                    }
                    else {
                        res.json({ 'status': false, 'message': 'Error' })
                    }
                })
            }
            else {
                return res.json({ status: true, message: 'Already applied' });


            }
        })



    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}



exports.tokenDeploy = (req, res) => {
    try {

        var userId = req.userId

        power.findOne({ "userId": mongoose.Types.ObjectId(userId) }, (powerError, powerLimitData) => {
            console.log(powerLimitData, "powerLimitData");

            if (powerLimitData != null && powerLimitData.total_power >= 1) {
                let abiArr = req.body.abiArr;
                let byteCode = req.body.byteCode;
                let name = "CTVB";
                const headers = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                };

                usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {
                    if (getsData) {

                        var hexAddress = getsData.hexAddress;
                        var address = getsData.address;

                        var pvtkey1 = common.decrypt(getsData.endRandom)
                        var pvtkey2 = common.decrypt(getsData.aceRandom)
                        var pvtkey = pvtkey1 + pvtkey2

                        let requestParams = {
                            "address": getsData.hexAddress
                        }
                        Request({
                            url: contractURL + "/getaccountresource",
                            method: "POST",
                            json: true,
                            body: requestParams
                        }, function (error, response, body) {
                            console.log();
                            if (body) {
                                var powerLimit = body.chintwoPowerLimit;

                                if (powerLimitData.total_power >= 1) {

                                    let deploy = {
                                        "abi": abiArr,
                                        "bytecode": byteCode,
                                        "owner_address": hexAddress,
                                        "name": name,
                                        "fee_limit": 100000000,
                                    }

                                    Request({
                                        url: contractURL + "/deploycontract",
                                        method: "POST",
                                        json: true,
                                        body: deploy,
                                        headers: headers

                                    }, function (error, response, body) {
                                        if (response) {
                                            console.log(response, "---------------response");
                                            const req1 = {
                                                transaction: {
                                                    raw_data: body.raw_data,
                                                    raw_data_hex: body.raw_data_hex,
                                                },
                                                privateKey: pvtkey
                                            };
                                            Request({
                                                url: contractURL + "/gettransactionsign",
                                                method: "POST",
                                                json: true,
                                                body: req1,
                                                headers: headers

                                            }, function (error, response, body) {
                                                if (response) {

                                                    console.log(response, "__________________response");
                                                    Request({
                                                        url: contractURL + "/broadcasttransaction",
                                                        method: "POST",
                                                        json: true,
                                                        body: body,
                                                        headers: headers

                                                    }, function (error, response, body) {
                                                        if (response) {
                                                            let id1 = body.txid
                                                            let transaction_id1 = {
                                                                "value": id1.toString()
                                                            }

                                                            setTimeout(function () {
                                                                Request({
                                                                    url: contractURL + "/gettransactioninfobyid",
                                                                    method: "POST",
                                                                    json: true,
                                                                    body: transaction_id1
                                                                }, function (error, response, body) {
                                                                    if (response) {
                                                                        console.log(body, "------------_________body");
                                                                        console.log(body.receipt.result, "------------resres");
                                                                        if (body.receipt.result == "SUCCESS") {

                                                                            let contract_address = body.contract_address;
                                                                            let tran_id = body.id;



                                                                            let data = { hexAddress: hexAddress, destkey: pvtkey, hash: tran_id, userId: userId, tokenAddress: contract_address }

                                                                            console.log(data, "data---------------");
                                                                            common.getAPI("getdetail", data, function (finalRes) {
                                                                                console.log(finalRes, "finalRes");
                                                                                if (finalRes.status) {

                                                                                    common.getAPI("txforTokendep", finalRes.resData, function (result) {
                                                                                        console.log(result, "result------");
                                                                                        if (result.status) {
                                                                                            res.json(finalRes)
                                                                                        }
                                                                                        else {
                                                                                            res.json({ 'status': false, 'message': 'Error' })
                                                                                        }
                                                                                    })
                                                                                } else {

                                                                                    res.json({ 'status': false, 'message': 'Error Occurred' })

                                                                                }
                                                                            })
                                                                        }
                                                                        else {
                                                                            res.json({ 'status': false, 'message': 'Error' })
                                                                        }
                                                                    }
                                                                    else {
                                                                        res.json({ 'status': false, 'message': 'Something went wrong' })
                                                                    }
                                                                })
                                                            }, 9000)
                                                        }
                                                    })
                                                }
                                                else {
                                                    res.json({ 'status': false, 'message': 'Something went wrong.. Please try again later' })
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    res.json({ 'status': false, 'message': 'Earn CII Power by staking CII for deploying token' })
                                }
                            }
                            else {
                                res.json({ 'status': false, 'message': 'Error occurred' })
                            }
                        })
                    }
                    else {
                        res.json({ 'status': false, 'message': 'User data not found' })
                    }
                })
            }
            else {
                res.json({ 'status': false, 'message': 'You need to freeze Chin Two before token deployment' })
            }
        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}

exports.staking = (req, res) => {

    try {
        var user_id = req.userId;
        usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {
            console.log(getsData, "getsData")
            var frozen_balance = req.body.freezeBalance;

            var frozen1 = (req.body.freezeBalance) / 1000000;


            var pvtkey1 = common.decrypt(getsData.endRandom)
            var pvtkey2 = common.decrypt(getsData.aceRandom)
            var pvtkey = pvtkey1 + pvtkey2



            var Bal;
            let requestParams = { "address": getsData.hexAddress };
            console.log(requestParams, "requestParams")
            await Request({
                url: contractURL + "/getaccount",
                method: "POST",
                json: true,
                body: requestParams
            }, async function (error, response, body) {
                Bal = body.balance;
            })
            if ({ Bal: { $gte: frozen_balance } }) {
                let requestParams = {
                    "owner_address": getsData.hexAddress,
                    "frozen_duration": 3,
                    "resource": "ENERGY",
                    "frozen_balance": frozen_balance
                }
                const headers = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                };

                await Request({
                    url: contractURL + "/freezebalance",
                    method: "POST",
                    json: true,
                    body: requestParams,
                    headers: headers

                }, function (error, response, body) {
                    var tx = body.txID;
                    var raw = body.raw_data;
                    var raw_hex = body.raw_data_hex


                    if (tx && raw && raw_hex) {


                        const req = {
                            transaction: {
                                raw_data: body.raw_data,
                                raw_data_hex: body.raw_data_hex,
                            },
                            privateKey: pvtkey,
                        };
                        Request({
                            url: contractURL + "/gettransactionsign",
                            method: "POST",
                            json: true,
                            body: req,
                            headers: headers

                        }, function (error, response, body) {
                            if (body.signature && body.txID && body.raw_data && body.raw_data_hex) {

                                Request({
                                    url: contractURL + "/broadcasttransaction",
                                    method: "POST",
                                    json: true,
                                    body: body,
                                    headers: headers

                                }, function (error, response, body) {
                                    if (body.txid) {
                                        var tranhash = body.txid;
                                        let requestParams = {
                                            "address": getsData.hexAddress
                                        }


                                        power.findOne({ "userId": user_id }, (err, resultData) => {
                                            console.log(resultData, "resultData")
                                            if (!err && resultData) {
                                                power.updateOne({ '_id': mongoose.Types.ObjectId(resultData._id) }, {
                                                    "$set": {
                                                        "total_power": resultData.total_vote + frozen1,
                                                        "total_vote": resultData.total_vote + frozen1,
                                                        "modifiedDate": Date.now()
                                                    }
                                                }, (err, powerDet) => {
                                                    console.log(err, "errwed")
                                                    console.log(powerDet, "powerDet")
                                                })

                                            }
                                            else {
                                                power.create({ "userId": user_id, "total_power": frozen1, "total_vote": frozen1 }, (err, created) => {
                                                    console.log("created", created)
                                                    console.log(err, "err")
                                                    if (!err && created) {


                                                    }
                                                })
                                            }

                                        })
                                        const date = new Date();
                                        date.setDate(date.getDate() + 3);
                                        const date1 = new Date();
                                        date1.setDate(date1.getDate());
                                        console.log()

                                        stakeToken.create({
                                            "userId": getsData._id,
                                            "hexAddress": getsData.hexAddress,
                                            "hash": tranhash,
                                            "amount": frozen1,
                                            "type": "stake",
                                            "unstakeTime": date,
                                            "createdDate": date1,
                                            "status": 0

                                        }, function (err, data) {
                                            console.log(data, "data")
                                            if (data) {
                                                const stake_id = data._id;
                                                const stake_hash = data.hash;


                                                userInfo.updateOne({ '_id': user_id },
                                                    {
                                                        "$set": {
                                                            "staking_status": "true"
                                                        }
                                                    }, (err, details) => {
                                                        if (details) {
                                                            var dataa = { "_id": stake_id, "hash": stake_hash }
                                                            common.getAPI("txforStake", dataa, function (result) {
                                                                if (result) {
                                                                    res.json({ 'status': true, 'message': 'Your chin two staked successfully', 'data': result, "Unstake Time": date })

                                                                }
                                                                else {
                                                                    res.json({ 'status': false, 'message': 'Error' })
                                                                }
                                                            })

                                                        }
                                                        else {
                                                            res.json({ 'status': false, 'message': 'Unable to stake chin two' })
                                                        }
                                                    })
                                            }
                                            else { res.json({ 'status': false, 'message': 'Unable to update the details' }) }
                                        })





                                    }
                                    else {
                                        res.json({ 'status': false, 'message': 'Something went wrong.... Please try again later' })
                                    }
                                })
                            }
                            else {
                                res.json({ 'status': false, 'message': 'Error occurred... Please try again later' })
                            }
                        }

                        )




                    }
                    else {
                        res.json({ 'status': false, 'message': 'Error' })
                    }


                });
            }
            else {
                res.json({ 'status': false, 'message': "Balance should be greater than your freezing amount" })
            }
        })
    }


    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}


exports.getStake = (req, res) => {

    try {


        let reqParam = req.body;
        let reqData = reqParam.payload;
        let filter = (reqData.filtered) ? reqData.filtered : '';
        let pageNo = (reqData.page) ? reqData.page : '0';
        let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { createdDate: -1 };
        var where = { "userId": mongoose.Types.ObjectId(req.userId) }
        var unstake_time;
        async.parallel({

            tokenStakeList: function (cb) {

                stakeToken.find(where).skip(skip).limit(limit).sort(sort).exec(cb);

            },

            totalRecords: function (cb) {

                stakeToken.find(where).countDocuments().exec(cb);
            },

        }, function (err, results) {
            if (results.totalRecords != 0) {

                stakeToken.find({ "userId": mongoose.Types.ObjectId(req.userId), "type": "stake" }).sort({ createdDate: -1 }).exec((err, det) => {

                    unstake_time = det[0].unstakeTime;




                    var data = (results.totalRecords > 0) ? results.tokenStakeList : [];

                    var count = (results.totalRecords) ? results.totalRecords : 0;

                    return res.json({ status: true, data: data, count: count, unstake_time: unstake_time })
                });
            }
            else {
                res.json({ 'status': false, 'message': 'No stake history found' })
            }

        })
    }


    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}




exports.unstake = (req, res) => {
    try {

        usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {
            console.log(getsData, "getsData")
            if (getsData) {
                var userid = getsData._id;
                var hex = getsData.hexAddress;
                var pvtkey1 = common.decrypt(getsData.endRandom)
                var pvtkey2 = common.decrypt(getsData.aceRandom)
                var pvtkey = pvtkey1 + pvtkey2

                let requestParams = {
                    "owner_address": getsData.hexAddress,
                    "resource": "ENERGY"
                }
                console.log(requestParams, "requestParams");
                const headers = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                };
                await Request({
                    url: contractURL + "/unfreezebalance",
                    method: "POST",
                    json: true,
                    body: requestParams,
                    headers: headers

                }, function (error, response, body) {
                    console.log(body, "bdy")
                    console.log(error, "errorbdy")

                    var txid = body.txID;
                    var raw = body.raw_data;
                    var raw_hex = body.raw_data_hex
                    if (txid && raw && raw_hex) {


                        const req = {
                            transaction: {
                                raw_data: body.raw_data,
                                raw_data_hex: body.raw_data_hex,
                            },
                            privateKey: pvtkey,
                        };
                        Request({
                            url: contractURL + "/gettransactionsign",
                            method: "POST",
                            json: true,
                            body: req,
                            headers: headers

                        }, function (error, response, body) {
                            console.log(body, "body");
                            if (body.signature && body.txID && body.raw_data && body.raw_data_hex) {

                                Request({
                                    url: contractURL + "/broadcasttransaction",
                                    method: "POST",
                                    json: true,
                                    body: body,
                                    headers: headers

                                }, function (error, response, body) {
                                    console.log(body, "bodyfrg");
                                    if (body.txid) {
                                        var tranhash = body.txid;


                                        usersTbl.updateOne({ '_id': userid },
                                            {
                                                "$set": {
                                                    "staking_status": "false"
                                                }
                                            }, (err, details) => {
                                                console.log(details, "det")
                                                if (details) {
                                                    stakeToken.aggregate([
                                                        {
                                                            $match: { "hexAddress": getsData.hexAddress, "status": 0 },
                                                        }, {
                                                            $group: {
                                                                _id: null,

                                                                total: {
                                                                    $sum: "$amount"
                                                                }
                                                            }
                                                        }], (err, result) => {
                                                            console.log(result, "reslt")
                                                            stakeToken.create({
                                                                "userId": userid,
                                                                "hexAddress": hex,
                                                                "hash": tranhash,
                                                                "amount": result[0].total,
                                                                "type": "unstake",

                                                            }, (err, data) => {
                                                                if (!err && data) {
                                                                    console.log(data, "data")
                                                                    const stake_id = data._id;
                                                                    const stake_hash = data.hash;

                                                                    stakeToken.updateMany({ "userId": userid }, { $set: { status: 1 } }, async (err, res) => {
                                                                        console.log(res, "res")
                                                                    })


                                                                    let requestParams1 = {
                                                                        "address": getsData.hexAddress
                                                                    }

                                                                    power.findOne({ "userId": userid }, (err, resultData) => {
                                                                        console.log(resultData, "resultData")
                                                                        if (resultData) {
                                                                            power.updateOne({ '_id': resultData._id }, {
                                                                                "$set": {
                                                                                    "total_power": 0,
                                                                                    "total_vote": 0
                                                                                }
                                                                            }, (err, update) => {
                                                                                if (!err && update) {
                                                                                    console.log(update, "upd")
                                                                                    console.log(err, "err")

                                                                                    var dataa = { "_id": stake_id, "hash": stake_hash }
                                                                                    console.log(dataa, "dataa")
                                                                                    common.getAPI("txforUnStake", dataa, function (result) {

                                                                                        if (result) {
                                                                                            res.json({ 'status': true, 'message': 'Your chin two unstaked successfully', 'data': result })

                                                                                        }
                                                                                        else {
                                                                                            res.json({ 'status': false, 'message': 'Error' })
                                                                                        }
                                                                                    })
                                                                                    // res.json({'status':true, 'message':'Your chin two unstaked successfully', 
                                                                                    // 'data':result,
                                                                                    //  "Unstake Time":date})

                                                                                    // console.log(update,"update")
                                                                                } else {
                                                                                    console.log(err)
                                                                                }
                                                                            })
                                                                        }
                                                                    })


                                                                    // res.json({'status':true, 'data':data, 'message':'Unstaked the amount successfully'})
                                                                }
                                                                else {
                                                                    res.json({ 'status': false, 'message': 'Unable to unstake chin two' })
                                                                }
                                                            })
                                                        })



                                                }
                                                else {
                                                    res.json({ 'status': false, 'message': 'Oops! Something went wrong' })
                                                }
                                            })

                                    }
                                    else {
                                        res.json({ 'status': false, 'message': 'Something went wrong.... Please try again later' })
                                    }
                                })
                            }
                            else {
                                res.json({ 'status': false, 'message': 'Error occurred... Please try again later' })
                            }
                        }

                        )



                    }
                    else {
                        res.json({ 'status': false, 'message': 'You can unstake the amount after three days of staking period' })

                    }

                })
            }
            else {
                res.json({ 'status': false, 'message': 'Not staked yet' })
            }

        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}



exports.listUserDetails = (req, res) => {
    try {
        var id = req.userId;
        usersTbl.findOne({ "_id": mongoose.Types.ObjectId(id) }, (err, data) => {
            if (data) {
                var hex = data.hexAddress;
                var stake_status = data.staking_status;
                var witness_status = data.witness_status;

                res.json({
                    'status': true,
                    'data': {
                        "hexAddress": hex,
                        "stake_status": stake_status,
                        "witness_status": witness_status
                    }
                })
            }
            else {
                res.json({ 'status': false, 'message': 'No user found' })
            }
        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}

exports.stakeCollection = (req, res) => {
    try {


        let reqParam = req.body;
        let reqData = reqParam.payload;
        let filter = (reqData.filtered) ? reqData.filtered : '';
        let pageNo = (reqData.page) ? reqData.page : '0';
        let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { createdDate: -1 };
        var where = {}
        async.parallel({

            tokenStakeList: function (cb) {

                tokenStake.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
            },

            totalRecords: function (cb) {

                tokenStake.find(where).countDocuments().exec(cb);
            },

        }, function (err, results) {

            var data = (results.totalRecords > 0) ? results.tokenStakeList : [];
            var count = (results.totalRecords) ? results.totalRecords : 0;

            return res.json({ status: true, data: data, count: count })

        }
        )

    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Error occurred....' })
    }
}



exports.totStakeAmount = (req, res) => {
    try {
        usersTbl.findOne({ "_id": req.userId }, async (err, getsData) => {
            if (getsData) {
                var hex = getsData.hexAddress;



                stakeToken.find({ "status": 0, "type": "stake", "hexAddress": getsData.hexAddress }, (err, details) => {
                    if (!err && details.length > 0) {
                        stakeToken.aggregate([
                            {
                                $match: { "status": 0, "hexAddress": getsData.hexAddress },

                            },
                            {
                                $group: {
                                    _id: null,

                                    total: {
                                        $sum: "$amount"
                                    }
                                }
                            }], (err, data) => {
                                if (err) {
                                    res.json({ 'status': false, 'message': 'Error found in data' })
                                }
                                else {
                                    res.json({ 'status': true, 'data': data })
                                }
                            });
                    } else {
                        res.json({ 'status': true, 'data': 0 })
                    }

                })
            }
            else {
                res.json({ 'status': false, 'message': 'Something went wrong' })
            }

        })

    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Error occurred....' })
    }
}


exports.createWitness = (req, res) => {
    try {
        usersTbl.findOne({ "_id": req.userId }, (err, data) => {
            var pvtkey1 = common.decrypt(data.endRandom)
            var pvtkey2 = common.decrypt(data.aceRandom)
            var pvtkey = pvtkey1 + pvtkey2
            var address = data.hexAddress;

            let details = { destkey: pvtkey, url: req.body.url }

            common.getAPI("witness", details, function (resultData) {
                var urlHex = resultData;


                let requestParams = {
                    "owner_address": data.hexAddress,
                    "url": urlHex
                };

                Request({
                    url: contractURL + "/createwitness",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, (error, response, body) => {
                    if (body.txid) {
                        const headers = {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json"
                            },
                        };
                        const req = {
                            transaction: {
                                raw_data: body.raw_data,
                                raw_data_hex: body.raw_data_hex,
                            },
                            privateKey: pvtkey
                        };
                        Request({
                            url: contractURL + "/gettransactionsign",
                            method: "POST",
                            json: true,
                            body: req,
                            headers: headers
                        }, function (error, response, body) {
                            if (body.signature && body.txID && body.raw_data && body.raw_data_hex) {
                                Request({
                                    url: contractURL + "/broadcasttransaction",
                                    method: "POST",
                                    json: true,
                                    body: body,
                                    headers: headers
                                }, function (error, response, body) {
                                    if (body.txid) {
                                        var broadCast = body;
                                        var obj = {
                                            "user_id": mongoose.Types.ObjectId(userId),
                                            "tran_hash": body.txid,
                                            "hexAddress": address
                                        }
                                        witness.create(obj, (err, witnessData) => {
                                            if (witnessData) {
                                                usersTbl.updateOne({ 'hexAddress': address }, {
                                                    "$set": {
                                                        "witness_status": "true"
                                                    }
                                                }, (err, updateData) => {
                                                    if (updateData) {
                                                        res.json({ 'status': true, 'data': broadCast, 'message': obj })
                                                    }
                                                    else {
                                                        res.json({ 'status': false, 'message': 'Unable to update witness status' })
                                                    }
                                                })
                                            }
                                            else {
                                                res.json({ 'status': false, 'message': 'Unable to store witnesser data' })
                                            }
                                        });



                                    }
                                    else {
                                        res.json({ 'status': false, 'message': 'Unable to create witness' })
                                    }
                                })
                            }
                        })
                    }
                    else {
                        res.json({ 'status': false, 'message': 'Unable to get transaction hash' })
                    }
                })
            })
        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': e })
    }
}
exports.listWitness = (req, res) => {
    try {
        Request({
            url: contractURL + "/listwitnesses",
            method: "get",
            json: true

        }, (error, response, body) => {
            if (response) {
                res.json({ 'status': true, 'data': body })
            }
            else {
                res.json({ 'status': false, 'message': 'Error occurred' })
            }

        })

    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Oops! Something went wrong' })
    }
}

exports.listNodes = function (req, res) {
    common.getAPI('getNodeInfo', '', function (ethApicontract) {
        res.json({
            status: ethApicontract.status,
            res: ethApicontract,

        })
    })
}

exports.trxInfo = function (req, res) {
    common.getAPI('gettranxInfo', '', function (ethApicontract) {
        res.json({
            status: ethApicontract.status,
            res: ethApicontract,

        })
    })
}




exports.proposalCreate = async (req, res) => {
    const { title, content } = req.body;
    var user_id = mongoose.mongo.ObjectId(req.userId);


    if (!title) {
        res.json({ status: false, msg: "Title is required!" })
    } else if (!content) {
        res.json({ status: false, msg: "Content is required!" })
    } else {
        usersTbl.findOne({ '_id': user_id }, (err, userData) => {
            if (userData) {
                var pvtkey1 = common.decrypt(userData.endRandom)
                var pvtkey2 = common.decrypt(userData.aceRandom)
                var pvtkey = pvtkey1 + pvtkey2

                proposalDB.create({
                    "hexAddress": userData.hexAddress,
                    "title": title,
                    "content": content,
                    "votes.positive": 0,
                    "votes.negative": 0,
                    "votes.total": 0
                }, async (err, created) => {
                    if (!err && created) {
                        res.json({ 'status': true, 'message': 'Proposal created successfully... Waiting for admin approval', 'data': created })

                    }
                    else {
                        res.json({
                            status: false,
                            msg: "something went wrong!"
                        })
                        res.end()
                    }
                })
            }
            else {
                res.json({ 'status': false, 'message': 'You are not a valid user' })
            }
        })
    }
}




exports.positiveVote = (req, res) => {
    try {
        const proposal_id = req.body._id;
        const vote_count = req.body.vote;
        const vote_type = req.body.vote_type;
        let user_id = mongoose.Types.ObjectId(req.userId);
        if (vote_type == "positive") {
            power.findOne({ 'userId': user_id }, (err, powerDetails) => {
                console.log(powerDetails, "powerDetails");
                if (powerDetails.total_vote >= vote_count) {
                    var powerDetails = powerDetails.total_power;
                    proposalDB.findOne({ "_id": proposal_id }, (err, proposalData) => {
                        if (!err && proposalData != null) {
                            var total_positive = proposalData.positive;

                            var total_negative = proposalData.negative;

                            proposalVote.findOne({ "proposalId": proposal_id, "userId": user_id }, (err, voteHistory) => {
                                console.log(voteHistory, "----------voteHistory");
                                if (voteHistory) {
                                    if (vote_count < voteHistory.positive) {
                                        var voteDiff = voteHistory.positive - vote_count
                                        proposalVote.updateOne({ "_id": voteHistory._id }, { $set: { "positive": vote_count } }, (errr, data) => { })
                                        const total_pos = total_positive + vote_count;
                                        proposalDB.updateOne({ "_id": proposal_id }, { "$set": { "positive": total_positive + vote_count, "total": total_pos + total_negative } }, (errr, data) => {
                                            console.log(data, "------data");
                                        })
                                        power.findOne({ 'userId': user_id }, (err, powerData) => {
                                            console.log(powerData, "-----------powerData");
                                            var totalVote = powerData.total_vote - vote_count;
                                            if (totalVote <= 0) {
                                                power.updateOne({ 'userId': user_id }, { "$set": { "total_vote": 0, "total_power": 0 } }, (errr, data) => { })
                                            }
                                            else {
                                                let obj = {
                                                    "total_vote": powerData.total_vote - vote_count,
                                                    "total_power": powerData.total_power - vote_count,

                                                }
                                                console.log(obj, "objobj");
                                                // power.updateOne({'userId':user_id},{"$set":{"total_vote":powerData.total_vote - vote_count}},(errr, data)=>{

                                                power.updateOne({ 'userId': user_id }, { "$set": obj }, (errr, data) => {
                                                    console.log(data, "datadatadata");
                                                })
                                            }
                                        })

                                        res.json({ status: true, msg: "success" });

                                    }

                                    else {
                                        var voteDiff = vote_count - voteHistory.positive



                                        proposalVote.updateOne({ "_id": voteHistory._id }, { $set: { "positive": vote_count } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr", errr) }
                                        })
                                        const total_pos = total_positive + vote_count;
                                        proposalDB.updateOne({ "_id": proposal_id }, { "$set": { "positive": total_positive + vote_count, "total": total_pos + total_negative } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr", errr) }
                                        })
                                        power.findOne({ 'userId': user_id }, (err, powerData) => {
                                            var totalVote = powerData.total_vote - vote_count;
                                            if (totalVote <= 0) {
                                                power.updateOne({ 'userId': user_id }, { "$set": { "total_vote": 0, "total_power": 0 } }, (errr, data) => { })
                                            }
                                            else {
                                                power.updateOne({ 'userId': user_id }, { "$set": { "total_vote": powerData.total_vote - vote_count, "total_power": powerData.total_power - vote_count, } }, (errr, data) => { })
                                            }

                                        })

                                        res.json({ status: true, msg: "Voted Successfully" });
                                    }
                                }


                                else {
                                    let voteDetails = {
                                        "proposalId": proposal_id,
                                        "positive": vote_count,
                                        "userId": user_id,
                                    }
                                    proposalVote.create(voteDetails, (err, voteData) => {
                                        if (!err && voteData) {
                                            power.findOne({ 'userId': user_id }, (err, powerData) => {
                                                console.log("dfgdfhgfh------ujfgjhngh", powerData);
                                                var totalVote = powerData.total_vote - vote_count;
                                                if (totalVote <= 0) {
                                                    power.updateOne({ 'userId': user_id }, {
                                                        "$set": {
                                                            "total_vote": 0, "total_power": 0
                                                        }
                                                    }, (errr, data) => {
                                                        if (data) {
                                                            console.log("dataaa1etrt11", data)
                                                        }
                                                        else { console.log("errrr111fgfgf", errr) }
                                                    })
                                                } else {
                                                    power.updateOne({ 'userId': user_id }, {
                                                        "$set": {
                                                            "total_vote": powerData.total_vote - vote_count,
                                                            "total_power": powerData.total_power - vote_count,


                                                        }
                                                    }, (errr, data) => {
                                                        if (data) {
                                                            console.log("dataaa1etrt11", data)
                                                        }
                                                        else { console.log("errrr111fgfgf", errr) }
                                                    })
                                                }
                                            })

                                            proposalDB.updateOne({ "_id": proposal_id }, {
                                                "$set": {
                                                    "positive": vote_count,
                                                    "total": vote_count + total_negative
                                                }
                                            }, (err, data) => {
                                                if (data) {
                                                    console.log("proposal db updated data", data)
                                                } else {
                                                    console.log("not updated", err)
                                                }
                                            })


                                            res.json({ status: true, msg: "Voted Successfully", data: voteData });
                                        }
                                    })
                                }
                                // }
                            })
                        }
                        else {
                            console.log("userid5757")
                            res.json({ status: false, msg: "No proposal data found" });
                        }
                    })
                }
                else {
                    res.json({ 'status': false, 'message': 'You do not have enough energy to vote' })
                }
            })
        }
        else {
            res.json({ 'status': false, 'message': 'Please enter your positive votes' })
        }
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}


exports.negativeVote = (req, res) => {
    try {
        const proposal_id = req.body._id;
        const vote_count = req.body.vote;
        const vote_type = req.body.vote_type;
        let user_id = mongoose.Types.ObjectId(req.userId);
        if (vote_type == "negative") {
            power.findOne({ 'userId': user_id }, (err, powerDetails) => {

                if (powerDetails.total_vote >= vote_count) {
                    var powerDetails = powerDetails.total_power;

                    var totVote = powerDetails.total_vote
                    proposalDB.findOne({ "_id": proposal_id }, (err, proposalData) => {
                        let totalProposalvotes = proposalData.total;
                        if (!err && proposalData != null) {
                            var total_negative = proposalData.negative;
                            var total_positive = proposalData.positive;

                            proposalVote.findOne({ "proposalId": proposal_id, "userId": user_id }, (err, voteHistory) => {
                                if (voteHistory) {
                                    if (vote_count < voteHistory.negative) {
                                        var voteDiff = voteHistory.negative - vote_count
                                        proposalVote.updateOne({ "_id": voteHistory._id }, { $set: { "negative": vote_count } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr33", errr) }
                                        })
                                        const tot_neg = total_negative + vote_count;
                                        proposalDB.updateOne({ "_id": proposal_id }, { "$set": { "negative": total_negative + vote_count, "total": tot_neg + total_positive } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr111", errr) }
                                        })
                                        power.findOne({ 'userId': user_id }, (err, powerData) => {
                                            var totalVote = powerData.total_vote - vote_count;
                                            if (totalVote <= 0) {
                                                power.updateOne({ 'userId': user_id }, { "$set": { "total_vote": 0, "total_power": 0 } }, (errr, data) => {
                                                    if (data) {
                                                    } else { console.log("errrr11125", errr) }
                                                })
                                            }
                                            else {
                                                power.updateOne({ 'userId': user_id }, {
                                                    "$set": {
                                                        "total_vote": powerData.total_vote - vote_count, "total_power": powerData.total_power - vote_count,

                                                    }
                                                }, (errr, data) => {
                                                    if (data) {
                                                        console.log("dataaa666", data)
                                                    } else { console.log("errrr11125", errr) }
                                                })
                                            }
                                        })

                                        res.json({ status: true, msg: "success" });

                                    }

                                    else {
                                        var voteDiff = vote_count - voteHistory.negative
                                        proposalVote.updateOne({ "_id": voteHistory._id }, { $set: { "negative": vote_count } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr", errr) }
                                        })
                                        const totNeg = total_negative + vote_count
                                        proposalDB.updateOne({ "_id": proposal_id }, { "$set": { "negative": total_negative + vote_count, "total": totNeg + total_positive } }, (errr, data) => {
                                            if (data) {
                                            } else { console.log("errrr", errr) }
                                        })
                                        power.findOne({ 'userId': user_id }, (err, powerData) => {
                                            var totalVote = powerData.total_vote - vote_count;
                                            if (totalVote <= 0) {
                                                power.updateOne({ 'userId': user_id }, { "$set": { "total_vote": 0, "total_power": 0 } }, (errr, data) => {
                                                    if (data) {
                                                    } else { console.log("errrr1149891", errr) }
                                                })
                                            }
                                            else {
                                                power.updateOne({ 'userId': user_id }, {
                                                    "$set": {
                                                        "total_vote": powerData.total_vote - vote_count,
                                                        "total_power": powerData.total_power - vote_count,

                                                    }
                                                }, (errr, data) => {
                                                    if (data) {
                                                        console.log("dataaa144411", data)
                                                    } else { console.log("errrr114441", errr) }
                                                })
                                            }


                                        })

                                        res.json({ status: true, msg: "success" });
                                    }
                                }


                                else {
                                    let voteDetails = {
                                        "proposalId": proposal_id,
                                        "negative": vote_count,
                                        "userId": user_id,
                                    }
                                    proposalVote.create(voteDetails, (err, voteData) => {
                                        if (!err && voteData) {
                                            power.findOne({ 'userId': user_id }, (err, powerData) => {
                                                power.updateOne({ 'userId': user_id }, {
                                                    "$set": {
                                                        "total_vote": powerData.total_vote - vote_count,
                                                        "total_power": powerData.total_power - vote_count
                                                    }
                                                }, (errr, data) => {
                                                    if (data) {
                                                        console.log(data, "_________data");
                                                    } else { console.log("errrr111fgfgf", errr) }
                                                })
                                            })

                                            proposalDB.updateOne({ "_id": proposal_id }, {
                                                "$set": {
                                                    "negative": vote_count,
                                                    "total": vote_count + total_positive
                                                }
                                            }, (err, data) => {
                                                if (data) {
                                                    console.log("proposal db updated data", data)
                                                } else {
                                                    console.log("not updated", err)
                                                }
                                            })


                                            res.json({ status: true, msg: "Voted Successfully", data: voteData });
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.json({ status: false, msg: "No proposal data found" });
                        }
                    })
                }
                else {
                    res.json({ 'status': false, 'message': 'You do not have enough energy to vote' })
                }
            })
        }
        else {
            res.json({ 'status': false, 'message': 'Please enter your negative votes' })
        }
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}



exports.voteCount = (req, res) => {
    try {
        const proposal_id = req.body.proposal_id;
        proposalDB.findOne({ '_id': mongoose.Types.ObjectId(proposal_id) }, (err, proposalCount) => {
            if (proposalCount) {
                var positive = proposalCount.positive;
                var negative = proposalCount.negative;
                var total = positive + negative;
                proposalDB.updateOne({ '_id': mongoose.Types.ObjectId(proposal_id) }, {
                    "$set": { "total": total }
                }, (err, details) => {
                    if (details) {
                        res.json({ 'status': true, "positive": positive, "negative": negative, "total": total })
                    }
                    else {
                        res.json({ 'status': false, 'message': 'Unable to get data' })
                    }
                })

            }
            else {
                res.json({ 'status': false, 'message': "No such proposal id found" })
            }
        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}



exports.myProposal = (req, res) => {
    try {


        let params = req.body;
        let pageNo = params.page ? params.page : "0";
        let pageSize = params.pageSize ? params.pageSize : "0";
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { createdAt: -1 };

        var address = req.body.address;
        var where = { hexAddress: address }
        async.parallel({

            myProposalData: function (cb) {

                proposalDB.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
            },

            totalRecords: function (cb) {

                proposalDB.find(where).countDocuments().exec(cb);
            },

        }, function (err, results) {

            var data = (results.totalRecords > 0) ? results.myProposalData : [];

            var count = (results.totalRecords) ? results.totalRecords : 0;

            return res.json({ status: true, data: data, count: count })

        })

        // proposalDB.find({'hexAddress':address},(err, proposalData)=>{
        //     if(proposalData!=""){
        //         res.json({'status':true, 'data':proposalData})
        //     }
        //     else{
        //         res.json({'status':false, 'message':'No proposal found','count':proposalData.length})
        //     }
        // })
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}



exports.proposalList = async function (req, res) {
    try {
        let reqData = req.body;


        let filter = (reqData.filtered) ? reqData.filtered : '';
        let pageNo = (reqData.page) ? reqData.page : '0';
        let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { createdAt: -1 };

        let where = { "status": "active" }
        async.parallel({

            proposalList: function (cb) {

                proposalDB.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
            },

            totalRecords: function (cb) {

                proposalDB.find(where).countDocuments().exec(cb);
            },

        }, function (err, results) {

            var data = (results.totalRecords > 0) ? results.proposalList : [];
            var count = (results.totalRecords) ? results.totalRecords : 0;

            return res.json({ status: 200, data: data, counts: count })

        })

    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }

}



exports.voteeligible = (req, res) => {
    try {
        let user_id = mongoose.Types.ObjectId(req.userId);
        console.log("userid", user_id)
        power.findOne({ 'userId': user_id }, (err, details) => {
            if (details) {
                res.json({ 'status': true, 'data': details })
            }
            else {
                res.json({ 'status': false, 'message': 'No data found' })
            }
        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}


exports.tokenList = (req, res) => {
    try {
        let user_id = mongoose.Types.ObjectId(req.userId);
        let reqParam = req.body;
        let reqData = reqParam.payload;
        let filter = (reqData.filtered) ? reqData.filtered : '';
        let pageNo = (reqData.page) ? reqData.page : '0';
        let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { dated: -1 };
        var where = { "userId": user_id }

        async.parallel({

            tokenList: function (cb) {

                allTokensList.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
            },

            totalRecords: function (cb) {

                allTokensList.find(where).countDocuments().exec(cb);
            },

        }, function (err, results) {

            var data = (results.totalRecords > 0) ? results.tokenList : [];
            console.log("data", data)
            var count = (results.totalRecords) ? results.totalRecords : 0;
            console.log("count", count)


            return res.json({ status: true, data: data, count: count })

        })
    }
    catch (e) {
        res.json({ 'status': false, 'message': 'Something went wrong' })
    }
}

exports.proposalAmt = (req, res, next) => {
    try {

        const user_id = req.userId;
        console.log("userid", user_id)
        console.log("ownerAddress", ownerAddress)

        usersTbl.findOne({ '_id': mongoose.Types.ObjectId(user_id) }, (err, details) => {
            var pvtkey1 = common.decrypt(details.endRandom)
            var pvtkey2 = common.decrypt(details.aceRandom)
            var pvtkey = pvtkey1 + pvtkey2
            var hexAddress = details.hexAddress;
            console.log("proposal status", details.proposalStatus)
            if (details.proposalStatus == true) {
                console.log("dtai")
                next()
            } else {
                siteSetting.find({}, (err, siteDetails) => {
                    if (siteDetails) {
                        console.log("site details", siteDetails)
                        const propAmount = siteDetails[0].ProposalFee;
                        console.log("propsss", siteDetails[0].ProposalFee)
                        let requestParams = { address: hexAddress };

                        Request({

                            url: contractURL + "/getaccount",
                            method: "POST",
                            json: true,
                            body: requestParams

                        }, async function (error, response, body) {

                            var bodyBalance = body.balance / 1000000;
                            console.log("bal", bodyBalance)

                            if (bodyBalance >= propAmount) {
                                console.log("prop", siteDetails[0].ProposalFee)
                                let requestParams = {
                                    "to_address": ownerAddress,
                                    "owner_address": details.hexAddress,
                                    "amount": propAmount
                                };
                                console.log(requestParams, "requestParams")
                                Request({

                                    url: contractURL1 + "/createtransaction",
                                    method: "POST",
                                    json: true,
                                    body: requestParams

                                }, async function (error, response, body) {
                                    if (response.statusCode === 200) {

                                        if (!body.Error) {
                                            let rawData = body.raw_data;
                                            let rawDataHex = body.raw_data_hex;

                                            let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': pvtkey }

                                            Request({

                                                url: contractURL1 + "/gettransactionsign",
                                                method: "POST",
                                                json: true,
                                                body: signTransParams

                                            }, async function (signError, signResponse, signBody) {

                                                if (!signBody.Error) {
                                                    Request({

                                                        url: contractURL1 + "/broadcasttransaction",
                                                        method: "POST",
                                                        json: true,
                                                        body: signBody

                                                    }, async function (broadCastError, broadCastResponse, broadCastBody) {

                                                        if (!broadCastBody.Error) {

                                                            if (broadCastBody.result) {

                                                                console.log("result", broadCastBody)


                                                                usersTbl.updateOne({ "_id": user_id }, {
                                                                    "$set": {
                                                                        "proposalStatus": "true"
                                                                    }
                                                                }, (err, updated) => {
                                                                    if (updated) {
                                                                        console.log("stat", updated)
                                                                    }
                                                                    else {
                                                                        console.log("derere", err)
                                                                    }
                                                                })

                                                                const reqParams = { "hash": broadCastBody.txid, "user_id": user_id }
                                                                common.getAPI("txforProposal", reqParams, function (finalResult) {
                                                                    if (finalResult) {
                                                                        var res = finalResult;
                                                                        next()
                                                                    }
                                                                    else { console.log("errrrr") }
                                                                })


                                                            } else {

                                                                return res.json({ status: false, message: 'Broadcast status failed' });
                                                            }

                                                        } else {

                                                            return res.json({ status: false, message: 'Transaction broadcast failed' });
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
                            }
                            else {
                                res.json({ 'status': false, 'message': 'Your Chin Two amount is less than proposal raising fee' })
                            }
                        })

                    }
                    else {
                        res.json({ 'status': false, 'message': 'Error' })

                    }
                })
            }
        })
    }
    catch (e) {

    }
}


//list SR
exports.listSuperRepresentatives = (req, res) => {
    try {
        let pageNo = (req.body.page) ? req.body.page : '0';
        let pageSize = (req.body.pageSize) ? req.body.pageSize : '0';
        var skip = +pageNo * pageSize;
        var limit = +pageSize;
        var sort = { date: -1 };
        // console.log(req.body, "req.body");

        common.proposal('listSuperRepresentatives', '', function (ethApidet) {
            // console.log(ethApidet, "ethApidet");

            for (var j = 0; j < ethApidet.SuperRepresentative_List.witnesses.length; j++) {
                (function () {
                    var srId = j;
                    var srAdd = ethApidet.SuperRepresentative_List.witnesses[j].address;
                    var srVote = ethApidet.SuperRepresentative_List.witnesses[j].voteCount;
                    var srUrl = ethApidet.SuperRepresentative_List.witnesses[j].url;
                    var srPro = ethApidet.SuperRepresentative_List.witnesses[j].totalMissed;
                    // var srblock= ethApidet.SuperRepresentative_List[j].latestBlockNum;
                    // var srslot= ethApidet.SuperRepresentative_List[j].latestSlotNum;
                    var srjobs = ethApidet.SuperRepresentative_List.witnesses[j].isJobs;

                    var addData = { 'address': srAdd }

                    common.proposal('getaddress', addData, function (ethApiAccount) {
                        // console.log(ethApiAccount, "ethApiAccount");
                        common.proposal('getBrokerage', addData, function (ethBrokerage) {
                            console.log('ethBrokerage -->', ethBrokerage);
                            common.proposal('getAccount', addData, function (ethApibal) {
                                // console.log(ethApibal, "ethApibal");
                                var status = ethApibal.status
                                if (status == true) {

                                    SRdetails.findOne({ address: ethApiAccount.getaddress }).exec(function (proErr, proRes) {
                                        // console.log(proRes, "proRes");
                                        if (proRes) {
                                            if (proRes.voteCount != srVote) {
                                                status = 'Confirmed';
                                                votePending = 0;
                                            }
                                            else {
                                                status = 'Pending';
                                                votePending = proRes.votePending;
                                            }

                                            if (proRes.sr_id == (srId + 1)) {
                                                var last_rank = proRes.sr_id;
                                            } else {
                                                var last_rank = srId + 1;
                                            }
                                            let obj = {
                                                last_rank: last_rank,
                                                sr_id: srId,
                                                address: ethApiAccount.getaddress,
                                                hexAddress: ethApiAccount.hexAddress,
                                                voteCount: srVote,
                                                // allowance  : allowance,
                                                brokerage: ethBrokerage.result,
                                                votePending: votePending,
                                                url: srUrl,
                                                totalMissed: srPro,
                                                // latestBlockNum  : srblock,
                                                // latestSlotNum  : srslot,
                                                isJobs: srjobs,
                                                status: status
                                            };
                                            // console.log(obj, "obj");
                                            SRdetails.updateOne({ address: ethApiAccount }, { $set: obj }, { multi: true }).exec(function (upError, upRes) {
                                                // console.log(upRes, "upRes");
                                            });
                                        } else {
                                            let obj = {
                                                sr_id: srId,
                                                address: ethApiAccount.getaddress,
                                                hexAddress: ethApiAccount.hexAddress,
                                                voteCount: srVote,
                                                // allowance  : allowance,
                                                brokerage: ethBrokerage.result,
                                                url: srUrl,
                                                totalMissed: srPro,
                                                // latestBlockNum  : srblock,
                                                // latestSlotNum  : srslot,
                                                isJobs: srjobs,
                                                status: 'Pending'
                                            };
                                            SRdetails.create(obj, function (err, resData) {
                                                // console.log(err, "errerr");
                                                // console.log(resData, "resData");
                                            });
                                        }
                                    })

                                }
                            })
                        })
                    })
                })()
            }
            if (ethApidet.status == true) {
                SRdetails.find().skip(skip).limit(limit).sort({ "voteCount": -1 }).exec(function (proErr, proRes2) {
                    console.log(proRes2, "proResgdsf");
                    // console.log(proErr,"proErrdf");
                    res.json({ status: 1, result: proRes2 });
                });
            } else {
                res.json({ status: 0, result: [] });
            }
        });
    } catch (err) {
        console.log(e);
        res.json({ status: 0, msg: err });

    }
}

//apply SR
exports.applyForSR = (req, res, next) => {
    try {
        let userId = req.userId;
        let info = req.body;
        console.log(info, "____________________________info");
        usersTbl.findOne({ _id: userId }).exec(function (addErr, addRes) {
            if (addRes) {
                console.log(addRes, "addRes")
                var address = addRes.hexAddress;
                var balData = { 'address': address }
                // common.getAPI('balance',balData,function(ethApibal) {
                chckUserBalance(req, async function (response) {
                    console.log(response, "response")
                    if (response) {
                        var bal = response.balance / 1000000
                    } else {
                        var bal = 0
                    }
                    var minBal = 9999;
                    if (bal > minBal) {
                        // var destKey = info.privatekey;
                        // console.log(destKey,"destKey")

                        var pvtkey1 = common.decrypt(addRes.endRandom)
                        var pvtkey2 = common.decrypt(addRes.aceRandom)
                        var pvtkey = pvtkey1 + pvtkey2
                        var destKey = pvtkey;
                        console.log(destKey, "destKey")


                        var srUrl = info.url;
                        // srUrl = srUrl.search("http") == -1 ? srUrl = 'http://'+srUrl : srUrl;
                        let data = { address: address, 'destkey': destKey, 'url': srUrl };
                        console.log(data, "----------------------data");
                        common.proposal('applyForSR', data, function (ethApiSR) {
                            console.log(ethApiSR, "ethApiSR")
                            var txid = ethApiSR.txid;

                            if (ethApiSR.status == true) {
                                let obj = {
                                    name: info.name,
                                    user_id: userId,
                                    fromAdd: address,
                                    toAdd: ownerAddress,
                                    amount: 9999,
                                    transaction_id: txid,
                                    currency: 'CII',
                                    type: 'Apply For GB Fee',
                                    note: 'Apply For GB Fee',
                                    status: 1
                                }
                                srTbl.create(obj, function (err, insData) {
                                    console.log(insData, "insData");
                                    if (insData) {

                                        usersTbl.updateOne({ _id: userId }, { $set: { SRstatus: true } }, (err, updated) => {
                                            console.log(err, "---err");
                                            console.log(updated, "-------------updated");
                                            if (!err && updated) {





                                                res.json({ status: 1, result: txid, msg: 'Super Representative Created Successfully' });



                                            } else {
                                                console.log("error in updating");
                                            }
                                        })

                                    }
                                    else {
                                        console.log(err, "error in storing data");
                                    }
                                });

                            } else {
                                console.log(ethApiSR.Error, "-----------------ethApiSR.Error");
                                res.json({ status: 0, result: [], msg: ethApiSR.message });
                            }
                        });
                    } else {
                        res.json({ status: 0, result: [], msg: 'You must have 9999 chin two for apply GB' });
                    }
                })
            } else {
                res.json({ status: 0, result: [], msg: 'wrong address' });
            }
        });
    } catch (err) {
        res.json({ status: 0, msg: err });
    }
}


//vote SR
exports.voteSR = (req, res) => {
    try {
        console.log("fjgbvfd");
        console.log("req", req.body);
        let info = req.body;
        let userId = req.userId;
        usersTbl.findOne({ _id: userId }).exec(function (addErr, addRes) {
            console.log(addRes, "addRes");
            if (addRes) {
                var address = addRes.hexAddress;
                var privateKey1 = common.decrypt(addRes.endRandom);
                var privateKey2 = common.decrypt(addRes.aceRandom);
                var pvtkey = privateKey1 + privateKey2;
                let data = { ownAddress: address, params: info, pvtkey: pvtkey };
                console.log('data -->', data);
                common.proposal('voteSR', data, function (ethApiPRO) {
                    console.log('ethApiPRO -->', ethApiPRO)
                    if (ethApiPRO.status == true) {

                        result = JSON.parse(ethApiPRO.result);
                        console.log(result, "result");
                        let srAdd = info.address;
                        let srkey = Object.keys(srAdd);
                        let srval = Object.values(srAdd);
                        for (var j = 0; j <= srkey.length; j++) {
                            //   if(srkey[j] != undefined){



                            var obj = { $set: { status: 'Pending', votePending: +(srval[j]) } };

                            var voteobj = {
                                user_id: userId,
                                hash: result.txid,
                                sraddress: srkey[j],
                                useraddress: address,
                                amount: srval[j],
                                note: info.note,
                                status: 1
                            }
                            SRdetails.updateOne({ address: srkey[j] }, obj, { multi: true }).exec(function (upError, upRes) {
                                console.log('voteobj -->', voteobj);
                                votesr.create(voteobj, function (err, insData) {

                                });
                            })




                            //   }
                        }

                        res.json({ status: 1, msg: 'Thanks For Your Voting' });
                    } else {
                        res.json({ status: 0, msg: ethApiPRO.Error });
                    }
                });
            } else {
                res.json({ status: 0, result: [], msg: 'Invalid user' });
            }
        });
    } catch (e) {
        console.log('e --->', e)
        res.json({ status: false, msg: e });
    }
};


exports.getReward = (req, res) => {
    try {
        let userId = req.userId;

        usersTbl.findOne({ _id: userId }).exec(function (addErr, addRes) {
            // console.log(addRes, "addRes");
            if (addRes) {
                var hex = addRes.hexAddress;


                let requestParams = { address: hex };

                Request({

                    url: contractURL1 + "/getReward",
                    method: "POST",
                    json: true,
                    body: requestParams

                }, async function (error, response, body) {

                    if (error) {
                        var response = body.Error.replace("tron", "cii");
                        return res.json({ "status": false, "message": response });

                    } else {

                        // console.log(error, "error");
                        // console.log(body, "body");
                        res.json({ 'status': true, 'data': body })
                    }




                })




            }
        })

    } catch (e) {
        console.log('e --->', e)
        res.json({ status: false, msg: e });
    }
}


// exports.withdrawReward = (req, res) => {
//     try {
//         let userId = req.userId;

//         usersTbl.findOne({ _id: userId }).exec(function (addErr, addRes) {
//             console.log(addRes, "addRes");
//             if (addRes) {
//                 var hex = addRes.hexAddress;
//                 var addr = addRes.address;

//                 var pvtkey1 = common.decrypt(addRes.endRandom)
//                 var pvtkey2 = common.decrypt(addRes.aceRandom)
//                 var pvtkey = pvtkey1 + pvtkey2

//                 let requestParams = { owner_address: addr };
//                 setTimeout(() => {
//                     Request({

//                         url: contractURL1 + "/withdrawBlockRewards",
//                         method: "POST",
//                         json: true,
//                         body: requestParams

//                     }, async function (error, response, body) {
//                         console.log(error, "error");
//                         console.log(body, "body");

//                         if (error == null) {
//                             let rawData = body.raw_data;
//                             let rawDataHex = body.raw_data_hex;

//                             let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': pvtkey }

//                             console.log("-------------------> ~ signTransParams", signTransParams)
//                             Request({

//                                 url: contractURL1 + "/gettransactionsign",
//                                 method: "POST",
//                                 json: true,
//                                 body: signTransParams

//                             }, async function (signError, signResponse, signBody) {
//                                 console.log("-------------------> ~ signBody", signBody)
//                                 console.log("-------------------> ~ signError", signError)

//                                 if (signError == null) {
//                                     Request({

//                                         url: contractURL1 + "/broadcasttransaction",
//                                         method: "POST",
//                                         json: true,
//                                         body: signBody

//                                     }, async function (broadCastError, broadCastResponse, broadCastBody) {
//                                         console.log("-------------------> ~ broadCastBody", broadCastBody)
//                                         console.log("-------------------> ~ broadCastError", broadCastError)

//                                         if (broadCastError == null) {

//                                             if (broadCastBody.result) {

//                                                 res.json({ 'status': true, 'message': "Reward Claimed Successfully" })

//                                             } else {
//                                                 console.log(broadCastBody, "sfjbd");
//                                                 return res.json({ "status": false, "message": 'broadcast status failed', Error: broadCastBody });

//                                             }


//                                         } else {

//                                             return res.json({ status: false, message: 'Transaction broadcast failed' });
//                                         }
//                                     })

//                                 } else {

//                                     return res.json({ status: false, message: 'Transaction sign failed' });
//                                 }

//                             })

//                         } else {
//                             var response = body.Error.replace("tron", "cii");
//                             return res.json({ "status": false, "message": response });
//                         }





//                     })
//                 }, 9000);





//             }
//         })

//     } catch (e) {
//         console.log('e --->', e)
//         res.json({ status: false, msg: e });
//     }
// }
exports.withdrawReward = (req, res) => {
    try {
        let userId = req.userId;

        usersTbl.findOne({ _id: userId }).exec(function (addErr, addRes) {
            console.log(addRes, "addRes");
            if (addRes) {
                var hex = addRes.hexAddress;
                var addr = addRes.address;

                var pvtkey1 = common.decrypt(addRes.endRandom)
                var pvtkey2 = common.decrypt(addRes.aceRandom)
                var pvtkey = pvtkey1 + pvtkey2

                let requestParams = { owner_address: addr };
                setTimeout(() => {
                    Request({

                        url: contractURL1 + "/withdrawBlockRewards",
                        method: "POST",
                        json: true,
                        body: requestParams

                    }, async function (error, response, body) {
                        console.log(error, "error");
                        console.log(body, "body");

                        if (error == null) {
                            let rawData = body.raw_data;
                            let rawDataHex = body.raw_data_hex;

                            let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': pvtkey }

                            console.log("-------------------> ~ signTransParams", signTransParams)
                            Request({

                                url: contractURL1 + "/gettransactionsign",
                                method: "POST",
                                json: true,
                                body: signTransParams

                            }, async function (signError, signResponse, signBody) {
                                console.log("-------------------> ~ signBody", signBody)
                                console.log("-------------------> ~ signError", signError)

                                if (signError == null) {
                                    Request({

                                        url: contractURL1 + "/broadcasttransaction",
                                        method: "POST",
                                        json: true,
                                        body: signBody

                                    }, async function (broadCastError, broadCastResponse, broadCastBody) {
                                        console.log("-------------------> ~ broadCastBody", broadCastBody)
                                        console.log("-------------------> ~ broadCastError", broadCastError)

                                        if (broadCastError == null) {

                                            if (broadCastBody.result) {

                                                res.json({ 'status': true, 'message': "Reward Claimed Successfully" })

                                            } else {
                                                console.log(broadCastBody, "sfjbd");
                                                return res.json({ "status": false, "message": 'broadcast status failed', Error: broadCastBody });

                                            }


                                        } else {

                                            return res.json({ status: false, message: 'Transaction broadcast failed' });
                                        }
                                    })

                                } else {

                                    return res.json({ status: false, message: 'Transaction sign failed' });
                                }

                            })

                        } else {
                            var response = body.Error.replace("tron", "cii");
                            return res.json({ "status": false, "message": response });
                        }





                    })
                }, 9000);





            }
        })

    } catch (e) {
        console.log('e --->', e)
        res.json({ status: false, msg: e });
    }
}

//chk balance callback
const chckUserBalance = async (req, callback) => {

    let getsData = { hexAddress: 1 }

    var validUser = await usersTbl.findOne({ _id: mongoose.Types.ObjectId(req.userId) }, getsData);


    let requestParams = { address: validUser.hexAddress };
    console.log(requestParams, "requestParams ckh");
    await Request({

        url: contractURL + "/getaccount",
        method: "POST",
        json: true,
        body: requestParams

    }, async function (error, response, body) {
        console.log(error, "errorerror");
        console.log(body, "bodyfdgv");
        callback(body);

    })

}




