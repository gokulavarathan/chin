
const mongoose  = require('mongoose');
const Helper 	= require('../hprftghftgj/nommoc');	
const Common    = require('../hprftghftgj/nommoc.js');
const BlockWeb = require("blockweb")
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
function onProxyRes(proxyRes, req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept')
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
}
			 
var fullnode = express();
fullnode.use('/', createProxyMiddleware({
	target: 'http://44.199.109.239:56662', //-> instance
	changeOrigin: true,
	onProxyRes
}));
fullnode.listen(2907);

var soliditynode = express();
soliditynode.use('/', createProxyMiddleware({
	target: 'http://44.199.109.239:56663', //-> instance
	changeOrigin: true,
	onProxyRes,
}));
soliditynode.listen(2908);

const fullNode = Common.decrypt('+XxS3LnRNvC0vi1ohYOibNl58eJbdJR565HvjsmJZHQ=');
const solidityNode = Common.decrypt('+XxS3LnRNvC0vi1ohYOibLJ/0BgTAFLwWShPkCD58nI=');
const eventServer = Common.decrypt('+XxS3LnRNvC0vi1ohYOibB7opcn/Jsuoq7KzxVvOpgE=');


module.exports.getdetail = async(req,res)=>{
  var address = Common.decrypt("+q7AqRDHv7C+6TvnYzCYYT58QjEg50X32cFNeicTsFsQgRv/XbD71n4NquJ+FRCd");
  var destkey = Common.decrypt("F5sWa1WKHXsVeDsJnX8CqaLCYomxUgGqCpRM+VRrA9+eUI2qjChUyKjzlP6LUIWZS4FKOgUmvk4YdG1yJtFWz08lcRRTD4fEk0mpXrUBgdQ=");


    const blockweb1 = new BlockWeb(
      fullNode,
      solidityNode,
      eventServer, 
      destkey
  );
  var getaddress = blockweb1.address.fromHex(address);

  const instance = await blockweb1.contract().at(getaddress);
  let name = await instance["name"]().call();
      let symbol = await instance["symbol"]().call();
      let totalSupply = await instance["totalSupply"]().call();
      let decimals = await instance["decimals"]().call();
      response = {status:true, name: name, symbol: symbol, totalSupply: totalSupply.toString(), decimals: decimals};
     


  }
