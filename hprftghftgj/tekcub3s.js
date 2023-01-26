let aws     = require('aws-sdk');
let config 	= require('../nddetdthtfjh/s3.env.js');
const s3 	= new aws.S3(config.awsOptions);
const fs 	= require('fs');

module.exports = {
	
	uploadImage : function(data, callback){
		
		if(data != null && data != undefined && data.path != '') {
		
			const s3bucket = s3;

			fs.readFile(data.path, function (err, filedata) {
			
				let splits = data.originalname.split('.');
				
				const params = {
					Bucket: config.awsOptions.bucket,
					Key: 'kyc' + Date.now().toString() + '.' + splits[(splits.length) - 1],
					Body: filedata,
					ACL: 'public-read'
				}

				s3bucket.upload(params, (err, fetchdata) => {
					
					

					if (err) {
						
						callback('')
					
					} else {
						
						callback(fetchdata);
					}
				});
			})

		} else {
			
			callback('')
		}
	}
};
