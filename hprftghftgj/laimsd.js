var nodemailer 	= require('nodemailer');
var mongoose 	= require('mongoose');
var common= require('../hprftghftgj/nommoc')
// let transporter = nodemailer.createTransport({
//     host : common.decrypt('IXPwtzUaD72n4gmIyc1g3fp+BuiVcYHeRd88fPM146szlgklAueQ7GtgyyiTnPXg'),
//     auth : { user: common.decrypt('mVf9IWQJe1QlGv6aPm+BIKLm6O68XFSVEVp5GQ0s2yQ='), pass: common.decrypt('VhNFbAcNtU+SGx08kl80bAQ9IeBplIie759ENx8KQKDTW2MJOZf05hDMFDhX1AC+') }
// });




var nodemailer 	= require('nodemailer');
var mongoose 	= require('mongoose');
var common= require('../hprftghftgj/nommoc')
let transporter = nodemailer.createTransport({
    host : common.decrypt('IXPwtzUaD72n4gmIyc1g3fp+BuiVcYHeRd88fPM146szlgklAueQ7GtgyyiTnPXg'),
    auth : { user: common.decrypt('mVf9IWQJe1QlGv6aPm+BIKLm6O68XFSVEVp5GQ0s2yQ='), pass: common.decrypt('VhNFbAcNtU+SGx08kl80bAQ9IeBplIie759ENx8KQKDTW2MJOZf05hDMFDhX1AC+') }
});


var sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(common.decrypt('vnMb7dx0i9OGegGZZKYiM6/bKD5OiSyv3rtx7SodC2Tsjr9lpT/l1L7SnpZ/fr9NfZtLcubXhmtThlD8fPhwN9oXW0YnaidmM0BA5nFpUoA= '));

var from_address 	=  common.decrypt("ZIRiPwpSCIuk20Gbl+zBniZboh0OtrJVfmOV1KwL8MY==");




module.exports = { 

	sendMail : function(subject, values, callback) {

		var details = { from: from_address, to: values.to, subject: subject, html: values.html };
sendGridMail.send(details).then(mail => {
	console.log("sdfjsdhij")
	return callback(true);
	
}).catch(err => {
console.error("Mail err", err);
return callback(false);
})
	}}











// module.exports = { 

// 	sendMail : function(subject, values, callback) {
	
// 		let mailOptions = {
// 			from 	: common.decrypt("uMN/5jLZ2JifkCahU3/BTOYz6ZKsyjwwzsw7y51TDco="),
// 			port 	: 465,
// 			to 		: values.to,
// 			subject : subject,
// 			html 	: values.html
// 		}

// 		transporter.sendMail(mailOptions, function(error, info) {
			
// 			if (error) {

// 				return callback(false);
			
// 			} else {
				
// 				return callback(true);
// 			}
// 		});
// 	},
// }