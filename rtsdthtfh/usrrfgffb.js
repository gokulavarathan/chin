const express = require('express');
const router = express.Router();
const multer = require('multer');
const registerController = require('../ctrhtfgjhnf/ucrgrdg');
const loginController = require('../ctrhtfgjhnf/nigolE');
const passwordController = require('../ctrhtfgjhnf/drowssarpegnachc');
const profileController = require('../ctrhtfgjhnf/elifop');
const kycController = require('../ctrhtfgjhnf/Efcyk');
const depositController = require('../ctrhtfgjhnf/tisoped');
const coinController = require('../ctrhtfgjhnf/COIN');
const WithdrawController = require('../ctrhtfgjhnf/wardhitw');
const validation = require('../hprftghftgj/valfesedf');
const jwtauth = require('../hprftghftgj/nommoc')
const transferController = require('../ctrhtfgjhnf/refsnart')
const apiController = require('../ctrhtfgjhnf/tnuoccAteg')
const p2pController = require('../ctrhtfgjhnf/TSAp2pDF')
const tfaController = require('../ctrhtfgjhnf/HGfatD')
const depController = require('../ctrhtfgjhnf/tnemyoledp')
const proposalController = require('../ctrhtfgjhnf/wen-lasoporp')
const stacking = require('../ctrhtfgjhnf/Adingcks')
const usdController = require('../ctrhtfgjhnf/dsu-nioc');
const tokendep = require('../ctrhtfgjhnf/yolpeDnekot')
const depositTranx = require('../rellortnoc/noicasnarttisoped')
const contDeploy = require('../ctrhtfgjhnf/yolpeDnekot')
const common = require('../hprftghftgj/nommoc')
const Common = require('../hprftghftgj/common')
// router.post('/test',common.test)
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
router.use(express.json())
router.get('/testing', registerController.testing);
router.post('/register', registerController.register);
router.post('/accountActivation', Common._validate_origin, registerController.accountActivation);
router.post('/accountLogin', loginController.accountLogin);
router.post('/contactus', Common._validate_origin, registerController.contactus);
router.get('/dailyTransfer', registerController.dailyTransfer);
router.get('/totalContracts', registerController.totalContracts)


router.get('/getcms', Common._validate_origin, registerController.getCms);
router.get('/getSiteDetail', registerController.getSettings);
router.post('/changePassword', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, passwordController.changePassword);
router.post('/forgetPassword', Common._validate_origin, passwordController.forgot);
router.post('/reset-password', Common._validate_origin, passwordController.passwordReset);
router.post('/getProfile', jwtauth.tokenMiddlewareAdmin, profileController.getProfile);
router.post('/updateProfile', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, profileController.updateProfile);
router.post('/getKycDocuments', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, kycController.getKycDocuments);
// router.post('/submitKyc', upload.array('kycProof',12), jwtauth.tokenMiddlewareAdmin, kycController.submitKyc); 
router.post("/submitKyc", Common._validate_origin, jwtauth.tokenMiddlewareAdmin, upload.fields([{ name: 'frontImg' }, { name: 'backImg' }, { name: 'selfieImg' }]), kycController.submitKyc)

router.post('/getCurrencyList', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositController.getCurrencyList);
router.post('/submitCryptoDeposit', jwtauth.tokenMiddlewareAdmin, depositController.submitCryptoDeposit);
router.post('/getCryptoDepositHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositController.getCryptoDepositHistory);
router.post('/submitFiatDeposit', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositController.submitFiatDeposit);
router.post('/getFiatDepositHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositController.getFiatDepositHistory);
router.post('/getAdminBankDetails', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositController.getAdminBankDetails);


router.post('/transactionHash', depositController.transactionList_search);
router.post('/transaction', Common._validate_origin, transferController.transactionHash);
router.post('/transactionInfo', Common._validate_origin, transferController.transactionInfoId);

router.post('/submitCryptoWithdraw', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, WithdrawController.submitCryptoWithdraw);
router.post('/getCryptoWithdrawHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, WithdrawController.getCryptoWithdrawHistory);
// router.post('/submitFiatWithdraw', jwtauth.tokenMiddlewareAdmin, WithdrawController.submitFiatWithdraw); 
router.post('/getFiatWithdrawHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, WithdrawController.getFiatWithdrawHistory);


router.post('/getBalance', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, WithdrawController.getbalance);

router.post('/transfer', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.transfer);
router.post('/transferlist', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.transferlist);
router.post('/chkbalance', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.chkbalance);//postman
router.post('/UserBal', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.UserBal);//postman
router.post('/totalSupply', transferController.totalSupply);
router.post('/withdrawBlockRewards', jwtauth.tokenMiddlewareAdmin,transferController.withdrawBlockRewards);

//allbalance api
router.get('/chckUserBalance', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.chckUserBalance);
router.get('/getaccount', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, apiController.getAccount);
router.post('/getAddress', Common._validate_origin, apiController.getAddress);  //search by address
router.get('/Balance', Common._validate_origin, transferController.balance);
router.get('/privatekey', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, registerController.provide_PrivateKey);

router.post('/tfaverify', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, tfaController.tfa_verify);
router.post('/tfavalidate', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, tfaController.twoFactorAuth);
router.get('/getUserDetails', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, tfaController.getUserDetails);


///p2p
router.post('/p2p', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.postAdvertisement)
router.get('/p2pMyAdvertisements', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getMyAdvertisement)
router.post('/p2pMyOrders', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getMyOrders)
router.post('/p2pOrders', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getOrders)
router.post('/p2pOrderCreate', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.orderCreate)
router.post('/p2pAddChat', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.chat)
router.post('/p2pChats', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getChat)
router.post('/p2pSwapChats/:_id', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getSwapChat)
router.post('/p2pBuyerConfirmation', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.buyerConfirmation)
router.post('/p2pSellerConfirmation', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.sellerConfirmation)
router.post('/p2pMappingStatus', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.mappingStatus)
router.post('/p2pOrderCancel', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.orderCancel)
router.post('/p2pDisputeRaise', upload.single('disputeProof'), jwtauth.tokenMiddlewareAdmin, p2pController.disputeRaise)
router.post('/getDisputeRaise', p2pController.getdisputeRaise)
router.get('/p2pGetNotification', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getNotification)
router.post('/p2pAdminChat', Common._validate_origin, upload.single('proofImg'), jwtauth.tokenMiddlewareAdmin, p2pController.disputeChat)
router.post('/p2pDisputeChats', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, p2pController.getDisputeChats)


router.post('/getdetail', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, transferController.getdetail);  //search by address
router.post('/supply', depController.getdetail);  //dummy

// PROPOSAL
router.post("/addproposal", Common._validate_origin, jwtauth.tokenMiddlewareAdmin, proposalController.addProposal)

// PROPOSAL VOTE
router.post("/voteproposal", Common._validate_origin, jwtauth.tokenMiddlewareAdmin, proposalController.voteProposal)

// PROPOSAL GET
router.post("/proposals", jwtauth.tokenMiddlewareAdmin, proposalController.proposalsList)

// PROPOSAL HISTORY - GET
router.post("/proposalvotes", Common._validate_origin, jwtauth.tokenMiddlewareAdmin, proposalController.proposalVotesList)

//get approved tokens list
router.post('/ApprovedTokenList', Common._validate_origin, registerController.ApprovedTokenList);
//transaction list


// router.post('/chkbalancecmn',Common._validate_origin, common.chkbalance); 
// router.post('/getTotalSupply',transferController.getdetail);  //search by address
router.post('/getTotalSupply', common.getdetail);

//stacking
router.post('/stacking', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, stacking.poststack);
router.post('/stackingHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, stacking.getStacked);


router.post('/stackingHistory', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, stacking.getStacked123);

//coin-usd conversion
router.post('/coinUsdConversion', usdController.coinUsdConversion);
// router.get('/apiUpdate',usdController.apiUpdate)


//token deployment
router.post('/tokendeployment', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, tokendep.handleFreeze);


router.post('/DepositTransaction', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, depositTranx.DepositTransaction);

// Explorer
router.get('/totalTransactions', depositController.trnxListsExplorer);
router.post('/explorerData', depositController.explorerData);
router.post('/stableCoinList', depositController.StableCoinData);
router.get('/StableCoinGraph', depositController.StableCoinGraph);
router.post('/VoteList', depositController.VoteList);
router.post('/worldMap', depositController.worldMap);

router.get('/pievalue', depositController.pievalue)
router.post('/coinInt', coinController.coinController)


router.post('/tokenDeploy', jwtauth.tokenMiddlewareAdmin, contDeploy.validateBal, contDeploy.tokenDeploy)

router.post('/tokenDeployAmt', jwtauth.tokenMiddlewareAdmin, contDeploy.tokenDeployAmount)

router.post('/tokenStaking', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.staking)

router.post('/tokenUnstaking', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.unstake)

router.post('/getStakeDetails', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.getStake)

router.get('/listUserDetails', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.listUserDetails)

router.post('/stakeCollection', Common._validate_origin, contDeploy.stakeCollection)

router.get('/totStakeAmount', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.totStakeAmount)

router.get('/listNodes', Common._validate_origin, contDeploy.listNodes)

router.get('/trxInfo', Common._validate_origin, contDeploy.trxInfo)

router.post('/createWitness', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.createWitness)

router.get('/listWitness', Common._validate_origin, contDeploy.listWitness)

router.post('/proposalCreate', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.proposalCreate)

router.post('/proposalAmtCheck', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.proposalAmt)

router.post('/applyForSR', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.applyForSR)

router.post('/listSuperRepresentatives', contDeploy.listSuperRepresentatives)

router.post('/voteSR', jwtauth.tokenMiddlewareAdmin, contDeploy.voteSR)

router.post('/getReward', jwtauth.tokenMiddlewareAdmin, contDeploy.getReward)

router.post('/withdrawReward', jwtauth.tokenMiddlewareAdmin, contDeploy.withdrawReward)

router.post('/votePositive', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.positiveVote)

router.post('/negativeVote', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.negativeVote)

router.post('/voteCount', Common._validate_origin, contDeploy.voteCount)

router.post('/myProposal', contDeploy.myProposal)

router.post('/proposalsList', Common._validate_origin, contDeploy.proposalList)

router.get('/energy', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.voteeligible)

router.post('/tokenList', Common._validate_origin, jwtauth.tokenMiddlewareAdmin, contDeploy.tokenList)






module.exports = router;
