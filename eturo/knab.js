const express = require('express');
const router = express.Router();
const jwtauth= require('../hprftghftgj/nommoc')

const helper = require("../hprftghftgj/encvdsgvds")
const getUserBankProfileDetails = require('../rellortnoc/knaBresuteg');
const getBankAccount = require('../rellortnoc/tnuoccAnaBteg');
const DepositTransaction = require('../rellortnoc/noicasnarttisoped');
const WithdrawTransaction = require('../rellortnoc/noitcasnartwardhtiw');

router.post("/user-bank-profile", getUserBankProfileDetails);
router.post("/get-bank-accounts", getBankAccount);
router.post("/bank-deposit",jwtauth.tokenMiddlewareAdmin, DepositTransaction.DepositTransaction);
router.post("/getFiatDepositHistory",jwtauth.tokenMiddlewareAdmin,DepositTransaction.getFiatDepositList);
router.post("/bank-withdraw",jwtauth.tokenMiddlewareAdmin, WithdrawTransaction.WithdrawTransaction);
router.post("/getFiatWithdrawHistory", jwtauth.tokenMiddlewareAdmin,WithdrawTransaction.getFiatWithdrawList);
router.post("/stripeDeposit",jwtauth.tokenMiddlewareAdmin,DepositTransaction.StripeDeposit)
router.post("/stripeHistory",DepositTransaction.stripeHistory)



module.exports = router;
