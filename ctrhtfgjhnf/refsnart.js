const mongoose = require('mongoose');
const Request = require('request');
const Helper = require('../hprftghftgj/nommoc');
const Common = require('../hprftghftgj/nommoc.js');
const express = require('express');
const transferList = require('../mdlhysreyh/tsilrefsnart')
var async = require("async");
const cointoken = require('../mdlhysreyh/bunotsp')
const user = require('../mdlhysreyh/usrscdsfgesdg');
const contractURL = Helper.contractAddress();
const ownerAddress = Helper.ownerAddress();
const ownerPrivateKey = Helper.ownerPrivateKey();
const BlockWeb = require("blockweb")
const { createProxyMiddleware } = require('http-proxy-middleware');
const allTokensList = require('../mdlhysreyh/tsiLnekotTlla');
const { ConnectContactLens } = require('aws-sdk');


module.exports.check = async (req, res) => {

	data = {
		id: req.body.id,
		transhash: req.body.transhash
	}
	Common.getAPI("txforfiat", data, function (ethApicontract) {
		if (ethApicontract) {
			res.json({ status: true, msg: "Transferred successfully" });
		}
	})
}

//transfer
module.exports.transfer = async (req, res) => {
	let reqData = req.body;
	console.log(reqData, "reqData");
	let reqAmount = reqData.amount;
	let reqToken = reqData.token;
	let userAddr = reqData.walletAddress;
	let asset = reqData.asset;
	reqAmount = amountConvert(reqAmount, 6, "towei")
	divAmount = amountConvert(reqAmount, 6, "fromwei")


	isAddrExist = await user.findOne({ "hexAddress": userAddr })
	var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
	if (validUser) {
		if (validUser.kyc_status == 1) {
			var pvtkey1 = Common.decrypt(validUser.endRandom)
			var pvtkey2 = Common.decrypt(validUser.aceRandom)
			var pvtkey = pvtkey1 + pvtkey2
			console.log(pvtkey, "p---------------------vtkey");
			let requestParams = { "owner_address": validUser.hexAddress, "amount": parseFloat(+reqAmount), "token": reqToken, "to_address": userAddr };
			isAddrExist = user.find({ "hexAddress": userAddr })
			if (isAddrExist) {
				if (reqToken == "ChinTwo") {
					console.log("----------------------> entered");
					chckUserBalance(req, async function (response) {
						if (response) {
							console.log(response, "--------------------------->response");
							if (response.balance < reqAmount) {
								return res.json({ status: false, message: ' Insufficient Balance.' });
							} else {

								//coin transfer														
								await Request({
									url: contractURL + "/createtransaction",
									method: "POST",
									json: true,
									body: requestParams
								}, async function (error, response, body) {
									console.log(body, "body");
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

																let obj = {
																	"user_id": req.userId,
																	"to_address": userAddr,
																	"amount": reqData.amount,
																	"token": reqData.token,
																	"approvehash": transhash

																};

																transferList.create(obj, function (err, resUpdate) {
																	if (resUpdate) {
																		var data = {
																			type: "coinTransfer",
																			hash: transhash,
																			transferList: resUpdate._id.toString()

																		}


																		Common.getAPI("txfortransfer", data, function (ethApicontract) {
																			if (ethApicontract.status) {
																				res.json({ status: true, msg: "Transferred successfully" });
																			} else {
																				res.json({ status: false, msg: ethApicontract.msg });

																			}
																		})

																	} else {

																		res.json({ status: false, msg: "Try again later" });
																	}
																});

															} else {

																res.json({ status: false, msg: 'broadCast status failed' });
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

											return res.json({ status: false, message: 'body.Error' });
										}

									} else {

										return res.json({ status: false, message: 'Please try again later' });
									}
								});
							}

						} else {

							res.json({ status: false, msg: 'Error in balance check' });
						}

					})
				}
				else {
					//token transfer

					var data = {
						amount: req.body.amount,
						token: req.body.token,
						user_id: req.userId,
						toaddress: userAddr

					}
					Common.getAPI('transfertoken', data, function (ethApicontract) {
						if (ethApicontract.status) {
							var transhash = ethApicontract.approvehash
							let obj = {
								"user_id": req.userId,
								"to_address": userAddr,
								"amount": reqData.amount,
								"token": reqData.token,
								"approvehash": transhash
							};
							transferList.create(obj, function (err, resUpdate) {
								if (resUpdate) {
									var data = {
										type: "tokenTransfer",
										hash: transhash,
										transferList: resUpdate._id.toString(),
										to_address: userAddr,

									}



									Common.getAPI("txfortransfer", data, function (ethApicontract) {
										if (ethApicontract.status) {
											res.json({ status: true, msg: "Transferred successfully" });
										} else {
											res.json({ status: false, msg: ethApicontract.msg });

										}
									})

								} else {

									res.json({ status: false, msg: "Try again later" });
								}
							});





						} else {
							res.json({
								status: false,
								message: ethApicontract.message
							})
						}

					});

				}
			}
			else {
				return res.json({ status: false, message: 'User not found' });

			}
		} else {
			res.json({ status: false, message: "KYC is not verified" });
		}
	} else {
		res.json({ status: false, message: "Invalid user ID" });
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


//transferlist
exports.transferlist = async (req, res) => {

	try {
		let params = req.body;
		let pageNo = params.page ? params.page : "0";
		let pageSize = params.pageSize ? params.pageSize : "0";
		var skip = +pageNo * pageSize;
		var limit = +pageSize;
		var sort = { date: -1 };


		var where = { user_id: req.userId }
		async.parallel({

			transferListData: function (cb) {

				transferList.find(where).skip(skip).limit(limit).sort(sort).exec(cb);
			},

			totalRecords: function (cb) {

				transferList.find(where).countDocuments().exec(cb);
			},

		}, function (err, results) {

			var data = (results.totalRecords > 0) ? results.transferListData : [];

			var count = (results.totalRecords) ? results.totalRecords : 0;

			return res.json({ status: true, data: data, count: count })

		})


	} catch (e) {

		res.json({ status: false, msg: 'Something went wrong ==> ' + e });
	}

}


//transfer callback
const chckUserBalance = async (req, callback) => {

	let getsData = { hexAddress: 1 }

	var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) }, getsData);


	let requestParams = { address: validUser.hexAddress };

	await Request({

		url: contractURL + "/getaccount",
		method: "POST",
		json: true,
		body: requestParams

	}, async function (error, response, body) {

		callback(body);

	})

}

//user Coin balance api
module.exports.chckUserBalance = async (req, res, callback) => {

	try {
		var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
		console.log(validUser, "----------------------------validUser");
		if (!validUser) {
			res.status(200).send({ status: false, code: 400, message: ' user not found ' })

		} else {

			let requestParams = { address: validUser.hexAddress };
			console.log(requestParams, "requestParams-----------------------");
			var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });


			var address = validUser.address;
			var hexAddress = validUser.hexAddress;
			var pvtkey1 = Common.decrypt(validUser.endRandom)
			var pvtkey2 = Common.decrypt(validUser.aceRandom)
			var userPvtkey = pvtkey1 + pvtkey2
			var destkey = userPvtkey.toString();
			data = { address: address, hexAddress: hexAddress, destkey: destkey }

			await Request({

				url: contractURL + "/getaccount",
				method: "POST",
				json: true,
				body: requestParams

			}, async function (error, response, body) {
				console.log(body, "---------------------------------bodybody");
				var bodyBalance = +(body.balance / Math.pow(10, 6)).toString();
				cointoken.findOne({ 'symbol': "CII" }, (err, CoinInfo) => {
					if (!err && CoinInfo) {

						let TokenData1 = { ...CoinInfo }._doc;


						Common.getAPI("balanceof", data, function (finalRes) {

							res.status(200).send({
								status: true, code: 200, Chin_balance: bodyBalance,

								chinUSD: TokenData1.chinUSD,
								tokenBalance: finalRes
							})
						})



					} else {
						console.log(err, "err")

					}
				})
			})
		}
	} catch (error) {
		res.status(error.response.status)
		return res.send(error.message);
		console.log(error)
	}

}

//testing api for balance check
module.exports.balance = async (req, res,) => {


	let requestParams = { address: req.body.address };


	await Request({

		url: contractURL + "/getaccount",
		method: "POST",
		json: true,
		body: requestParams

	}, async function (error, response, body) {

		var bodyBalance = +(body.balance / Math.pow(10, 6)).toString();

		res.status(200).send({ status: true, code: 200, Chin_balance: bodyBalance })
	})
}


//search by hash -- contract --2 api
exports.transactionHash = async (req, res) => {
	try {

		async.parallel({

			HashData: function (cb) {
				let requestParams = { value: req.body.value };


				Request({

					url: contractURL + "/gettransactionbyid",
					method: "POST",
					json: true,
					body: requestParams

				}, async function (error, response, body) {

					if (error) {
						cb(null, false);
					} else {
						cb(null, body)
					}
				})
			},

			HashInfoByID: function (cb) {
				let requestParams = { value: req.body.value };


				Request({

					url: contractURL + "/gettransactioninfobyid",
					method: "POST",
					json: true,
					body: requestParams

				},




					function (error, response, body) {

						if (error) {
							cb(null, false);
						} else {
							cb(null, body)
						}
					})
			},



			getAddress: function (cb) {
				let requestParams = { address: req.body.value };


				Request({

					url: contractURL + "/getaccount",
					method: "POST",
					json: true,
					body: requestParams

				}, async function (error, response, body) {

					if (error) {
						cb(null, false);
					} else {
						cb(null, body)
					}
				})
			},




		}, function (err, results) {


			var HashData = results.HashData;
			var HashInfoByID = results.HashInfoByID;
			var getAddress = results.getAddress;

			return res.json({ status: true, HashData: HashData, HashInfoByID: HashInfoByID, getAddress: getAddress })

		})
	} catch (err) {

		res.json({
			status: 412,
			message: "Unable to save"
		});
		res.end();
	}
}


//new----------------------------------
function onProxyRes(proxyRes, req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept')
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
}

var fullnode = express();
fullnode.use('/', createProxyMiddleware({
	target: 'http://44.198.210.6:46667', //-> instance
	changeOrigin: true,
	onProxyRes
}));
fullnode.listen(2905);

var soliditynode = express();
soliditynode.use('/', createProxyMiddleware({
	target: 'http://44.198.210.6:46667', //-> instance
	changeOrigin: true,
	onProxyRes,
}));
soliditynode.listen(2906);

const fullNode = 'http://44.198.210.6:46667';
const solidityNode = 'http://44.198.210.6:46667';
const eventServer = 'http://44.198.210.6:2095';
const privateKey = 'a1cb5c93d86118178da76214899bf73c040215ad560b8fb69e71110b54bc669b'
const blockWeb = new BlockWeb(
	fullNode,
	solidityNode,
	eventServer,
	privateKey
);
// user addr,hex,pvt,Coin balance
module.exports.UserBal = async (req, res) => {
	try {



		var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });

		if (!validUser) {
			res.status(200).send({ status: false, code: 400, message: ' user not found ' })
		}
		else {
			var address = validUser.address;
			var hexAddress = validUser.hexAddress;
			var pvtkey1 = Common.decrypt(validUser.endRandom)
			var pvtkey2 = Common.decrypt(validUser.aceRandom)
			var userPvtkey = pvtkey1 + pvtkey2
			var destkey = userPvtkey.toString();


			let requestParams = { address: hexAddress };


			await Request({

				url: contractURL + "/getaccount",
				method: "POST",
				json: true,
				body: requestParams

			}, async function (error, response, body) {


				var bodyBalance = +(body.balance / Math.pow(10, 6)).toString();

				res.status(200).send({ status: true, code: 200, Private_Key: destkey, Hex_Address: validUser.hexAddress, "Address": validUser.address, Chin_balance: bodyBalance });
			})

		}
	} catch (e) {
		response = { status: false, Error: e };


	}

}

// Chin token balance 
module.exports.chkbalance = async (req, res) => {
	try {
		var flag = req.body.onLoadSearch



		var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });

		if (!validUser) {
			res.status(200).send({ status: false, code: 400, message: ' user not found ' })
		}
		else {

			var address = validUser.address;
			var hexAddress = validUser.hexAddress;
			var pvtkey1 = Common.decrypt(validUser.endRandom)
			var pvtkey2 = Common.decrypt(validUser.aceRandom)
			var userPvtkey = pvtkey1 + pvtkey2
			var destkey = userPvtkey.toString();


			if (!flag) {
				data = { address: address, hexAddress: hexAddress, destkey: destkey }
				Common.getAPI("balanceof", data, function (finalRes) {
					res.json({
						status: true,
						data: finalRes
					});
				})

			} else {

				var data = { address: address, hexAddress: hexAddress, destkey: destkey, buyCurrency: req.body.buyCurrency }
				Common.getAPI("getSpecToken", data, function (finalRes) {
					res.json({
						status: true,
						data: finalRes
					});
				})


			}


		}
	} catch (e) {
		response = { status: false, Error: e };


	}

}


//get detail
module.exports.getdetail = async (req, res) => {


	var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });

	if (!validUser) {
		res.status(200).send({ status: false, code: 400, message: ' user not found ' })
	}
	else {

		var pvtkey1 = Common.decrypt(validUser.endRandom)
		var pvtkey2 = Common.decrypt(validUser.aceRandom)
		var userPvtkey = pvtkey1 + pvtkey2

		var hexAddress = req.body.Address;
		var hash = req.body.hash; var userId = req.userId

		var destkey = userPvtkey;



		data = { hexAddress: hexAddress, destkey: destkey, hash: hash, userId: userId }

		res.json({
			status: true,
			message: "Token Deployed. Waiting for Admin Approval"
		});


	}
}


exports.transactionInfoId = async (req, res) => {
	try {

		let requestParams = { value: "3145dc95d5bed14afea15bd96461262a7853240a2a8be18f7321569655e99661" };



		await Request({

			url: contractURL + "/gettransactioninfobyid",
			method: "POST",
			json: true,
			body: requestParams

		}, async function (error, response, body) {


			res.json({ status: true, data: body });

		})

	} catch (err) {

		res.json({
			status: 412,
			message: "Unable to save"
		});
		res.end();
	}
}



exports.totalSupply = async (req, res) => {

	try {
		console.log(req.body)
		var tokenAddr = req.body.tokenAddr
		//chin2admin
		// var destkey = privateKey;

		isvalidAdd()
		async function isvalidAdd() {
			console.log(tokenAddr, "tokenAddr")
			let instance = await blockWeb.contract().at(tokenAddr);
			//   console.log(instance)
			//   var owner = await instance['owner']().call();
			//    console.log('vowner -->',owner);
			let totalSupply = await instance["totalSupply"]().call();
			console.log('totalSupply -->', totalSupply.toString());
			var total = +(totalSupply / Math.pow(10, 6)).toString();
			res.json({ "totalSupply": total })
			//let burn =await instance["burn"](100).send()
			//   spender :"1c62a65.03997580cc5a059a226c3e8a7331fa07ffd3",
			//   subtractedValue:2000000
			// });
			//console.log(burn,"burn")
			// var balance = instance["balanceOf"](toaddress).call();
			//   balance = balance/1000000;

			//   if(balance > amount && type == 'burn'){
			//   response =  {status:false,Error:"The address does't have sufficient balance"}
			//   callback(response)
			// }else{
			//   if(addHex == fromKey){
			// var res = await instance["transfer"](
			//   "1ca8c5a04a02a283d5a9ad9303089a3eaf991dde49",
			//   "100000000000"
			// ).send();
			//  console.log("Transfer:", res);
			//     response = {status:true,sendTransaction:res};
			//   }else{
			//     response =  {status:false,Error:'Invalid Owner Address'}
			//   }
			//   console.log("mintBurn :",type, response);
			//   callback(response)
			// }



		}

	} catch (e) {

	}


}

exports.withdrawBlockRewards = async (req, res) => {



	var validUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
	console.log(validUser, "----------------------------validUser");

	var address = validUser.address;
	var hexAddress = validUser.hexAddress;
	var pvtkey1 = Common.decrypt(validUser.endRandom)
	var pvtkey2 = Common.decrypt(validUser.aceRandom)
	var userPvtkey = pvtkey1 + pvtkey2
	var destkey = userPvtkey.toString();


	try {
		isvalidAdd();
		async function isvalidAdd() {

			blockWeb.transactionBuilder.withdrawBlockRewards(hexAddress).then(async resp => {
				console.log("res", resp)
				// }).catch(err => console.log('errrr', err));

				let rawData = body.raw_data;
				let rawDataHex = body.raw_data_hex;

				let signTransParams = { 'transaction': { "raw_data": rawData, "raw_data_hex": rawDataHex }, 'privateKey': destkey };
				await Request({

					url: contractURL + "/gettransactionsign",
					method: "POST",
					json: true,
					body: signTransParams

				}, async function (signError, signResponse, signBody) {
					console.log("-------------------> ~ signError", signError)


					if (!signBody.Error) {

						await Request({

							url: contractURL + "/broadcasttransaction",
							method: "POST",
							json: true,
							body: signBody

						}, async function (broadCastError, broadCastResponse, broadCastBody) {
							console.log("-------------------> ~ broadCastBody", broadCastBody)
							console.log("-------------------> ~ broadCastError", broadCastError)


							if (!broadCastBody.Error) {

								if (broadCastBody.result) {
									let transhash = broadCastBody.txid;
									res.json({ status: true, message: 'Reward Claimed Successfully', last_withdraw_time: Date.now() });
									console.log("done")

								} else {

									res.json({ status: false, message: 'broadCast status failed' });
								}

							} else {

								res.json({ status: false, message: 'Transaction broadCast failed' });
							}
						})

					} else {

						res.json({ status: false, message: 'Transaction sign failed' });
					}
				})
			}).catch(err => {
				console.log("-------------------> ~ err", err)
				var response = err.replace("class org.tron.core.exception.ContractValidateException : The last withdraw time is 1657881150000, less than 24 hours", "Reward can be claimed only after 24hrs from your Previous Claim, Pls try later...");
				res.json({ status: false, message: response })


			})

		}

	} catch (e) {
		console.log("-------------------> ~ e", e)

	}


}