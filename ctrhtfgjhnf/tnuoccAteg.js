const mongoose  = require('mongoose');
const Request   = require('request');
const user 	     = require('../mdlhysreyh/usrscdsfgesdg');

const Helper 	= require('../hprftghftgj/nommoc');	
const contractURL 		= Helper.contractAddress();
const ownerAddress  	= Helper.ownerAddress();
const ownerPrivateKey 	= Helper.ownerPrivateKey();


module.exports.getAccount = async(req,res) =>{

	let getsData 	= {   hexAddress : 1 }

	var validUser 	= await user.findOne({ _id : mongoose.Types.ObjectId(req.userId) }, getsData);


	let requestParams = { address : validUser.hexAddress};

	await Request({
				    
	    url 	: contractURL+"/getaccount",
	    method 	: "POST",
	    json 	: true,
	    body 	: requestParams
	
	}, async function (error, response, body){
		
	
		res.status(200).send({status:true, code:200,Account_Details:body})
		

	})
	
}

//search by address
exports.getAddress = async (req, res) => {
	try {
	
	
			let requestParams = { address : req.body.value};
  
  
	    Request({
					  
		url 	: contractURL+"/getaccount",
		method 	: "POST",
		json 	: true,
		body 	: requestParams
	
	},  function (error, response, body){
			
		res.status(200).send({status:true, code:200,Account_Details:body})
			

	  })
	}catch (err) {
	  
	  res.json({
		status: 412,
		message: "Unable to save"
	  });
	  res.end();
	}
  }
