const express = require('express');
const axios = require("axios");
const fetch = require('node-fetch');

const qs = require('qs');
require('dotenv').config()

async function getHttpRequest(getParams = {}) {
  var url = process.env.WS_URL;
  
  

  var parameter = "";
  var paramLength = Object.keys(getParams).length;
  
  if (paramLength > 0) {
    parameter += "?";
    var i = 0;
    for (const getParamsKey in getParams) {
      parameter += `${getParamsKey}=${getParams[getParamsKey]}`;
      if (i != (paramLength - 1)) {
        parameter += "&";
      }
      i++;
    }
  }
  else {
    
  }

  var curlUrl = `${url}${parameter}`;
  
  
  var response = await axios.get(curlUrl);

  
  
  return await response.data;
}

async function postHttpRequest(postParams) {
  var response = await axios.post(process.env.WS_URL, qs.stringify(postParams));
  
  return await response.data;
}

module.exports = { getHttpRequest, postHttpRequest };
