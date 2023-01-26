
var encrypt= require('../hprftghftgj/nommoc').encrypt
var decrypt= require('../hprftghftgj/nommoc').decrypt
const CryptoJS = require("crypto-js");
const config = require('../nddetdthtfjh/config');
let key =  CryptoJS.enc.Base64.parse(config.cryptoKey);
let iv = CryptoJS.enc.Base64.parse(config.cryptoIv);
let jwtTokenAdmin = config.jwtTokenAdmin;

module.exports.awsOptions = {
	accessKeyId: decrypt('REZPfqwgwCkg/3UPXpnjaCNpdZgQOOWocodOoRvXgCM='),
	secretAccessKey: decrypt('8S/t2g5ZmuMhpw3M1cHhwhI4IcCmNV0BcDNUNEz1CvMWEaSX1E4l4jclUzOSeiLL'),
	bucket: decrypt('xq7ofdsCxk0C88g9wIveIg==')
}
