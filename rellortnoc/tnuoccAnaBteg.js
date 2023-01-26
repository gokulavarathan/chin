const express = require('express');
const md5 = require("md5");
const getRequestCurl = require('./lructseuquerteg');
require('dotenv').config()

// async function getBankAccount(req, res) {
 
//       res.status(200).json({
//         message: "Fiat Transaction is Under Maintenance",
//       });

//     }
  











async function getBankAccount(req, res) {
  const { email, dob } = req.body;
  
  var respon;
  var challangeToken;
  var getParams = {
    operation: "getchallenge",
    username: process.env.USER_NAME,
  };

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
        email: email.toString(),
        dob: dob.toString()
      };

      var paramsGetHolder = {
        operation: 'GetBankAccounts',
        sessionName: sessionName,
        element: JSON.stringify(user_2),
      };

      var response = await getRequestCurl.postHttpRequest(paramsGetHolder);
      console.log(response,"response")
      res.status(200).json({
        message: response,
      });

    }
  }
}
module.exports = getBankAccount;
