const mongoose = require('mongoose');
const coinUsdDB = require("../mdlhysreyh/noisrevnoc-dsu-nioc");

//create coin in db
exports.coinUsdConversion = async (req, res) => {
  try {
    let data = req.body;
    if (!data.cur_type) {
      res.json({ status: false, msg: "currency type is required!" })
    }
    else if (!data.fromCurrency) {
      res.json({ status: false, msg: "first currency is required!" })
    }
    else if (!data.toCurrency) {
      res.json({ status: false, msg: "second currency is required!" })
    }
    else if (!data.amount) {
      res.json({ status: false, msg: "amount is required!" })
    }
    else {
      coinUsdDB.findOne({ "currencies.currency": data.fromCurrency.toLowerCase() }, { "currencies.$": 1 }, (err, fromCurData) => {
        if (!err && fromCurData != null) {
          coinUsdDB.findOne({ "currencies.currency": data.toCurrency.toLowerCase() }, { "currencies.$": 1 }, (err, toCurData) => {
            if (!err && toCurData != null) {
              fromCurTotalUsdValue = data.amount * fromCurData.currencies[0].usd_price;
              toCurOneValue = 1 / toCurData.currencies[0].usd_price; // to cur usd value 
              toCurAmount = fromCurTotalUsdValue / toCurData.currencies[0].usd_price;
              // toCurAmount = toCurData.currencies[0].usd_price / fromCurTotalUsdValue;
              usdValues = {
                "fromCurrency": `${data.amount} ${data.fromCurrency}`,
                "toCurrency": `${toCurAmount} ${data.toCurrency}`,
                "oneFromCurrency": `${fromCurData.currencies[0].usd_price} usd`,
                "oneToCurrency": `${toCurData.currencies[0].usd_price} usd`,
              }
              res.json({
                status: true,
                data: usdValues,
              });
            } else {
              res.json({ status: false, msg: "second currency does not exists!" });
            }
          })
        } else {
          res.json({ status: false, msg: "first currency does not exists!" });
        }
      })
    }
  } catch (err) {

    res.json({
      status: false,
      msg: "Oops! Something went wrong. Please try again later",
    });
  }
};