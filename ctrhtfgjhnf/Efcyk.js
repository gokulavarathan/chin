const express = require('express');
const mongoose = require('mongoose');
const mailfn = require('../hprftghftgj/laimsd');
const common = require('../hprftghftgj/nommoc.js');
const s3bucket = require('../hprftghftgj/tekcub3s.js');

const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const kycTbl = require('../mdlhysreyh/klkrqew');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');


exports.getKycDocuments = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;

    var isExist = await usersTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), ac_status: 1 }).countDocuments();

    if (isExist > 0) {

      var kycDocuments = await kycTbl.findOne({ user_id: mongoose.mongo.ObjectId(req.userId) }, { _id: 0, user_id: 0 });

      res.json({ status: true, data: kycDocuments });

    } else {

      res.json({ status: false, msg: 'Invalid user.' });
    }

  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }

}


exports.submitKyc1 = async (req, res) => {

  try {

    let reqParam = req.body;
    let reqType = reqParam.type;

    var kycValid = await usersTbl.find({ _id: mongoose.mongo.ObjectId(req.userId), kyc_status: 0 }).countDocuments();

  

      var isExist = await kycTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId) }).countDocuments();

      if (isExist == 0) {

        uploadKyc(req, function (response) {
          if (response) {

            res.json({ status: true, msg: 'Your kyc has been submitted successfully.' });

          } else {

            res.json({ status: false, msg: 'Your kyc submission has been failed.' });
          }

        })

      } else {

        updateKyc(req, function (response) {

          if (response) {

            res.json({ status: true, msg: 'Your kyc has been re-submitted successfully.' });

          } else {

            res.json({ status: false, msg: 'Your kyc re-submission has been failed.' });
          }

        })
      }


  } catch (e) {

    res.json({ status: false, msg: 'Something went wrong.' });
  }

}


function uploadKyc(req,res, callback) {
  var imgArray = [];
  if (Object.keys(req.files).length > 0) {
    
    var kycValid =  kycTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), kyc_status: 0 }).countDocuments();
    

      if (req.files['frontImg'] != null || req.files['frontImg'] != undefined || req.files['frontImg'] != "") {
        var frontImgLink = req.files['frontImg'][0]
        s3bucket.uploadImage(frontImgLink, async function (imgRes) {
          var frontImg = imgRes.Location;
          if (req.files['backImg'] != null || req.files['backImg'] != undefined || req.files['backImg'] != "") {
            var backImgLink = req.files['backImg'][0]
            s3bucket.uploadImage(backImgLink, async function (imgRes) {
              var backImg = imgRes.Location;
              if (req.files['selfieImg'] != null || req.files['selfieImg'] != undefined || req.files['selfieImg'] != "") {
                var selfieImgLink = req.files['selfieImg'][0]
                s3bucket.uploadImage(selfieImgLink, async function (imgRes) {
                  var selfieImg = imgRes.Location;
                  let object = {
                    'frontImg': frontImg,
                    'backImg': backImg,
                    'selfieImg': selfieImg,
                    'frontImgStatus': 0,
                    'backImgStatus': 0,
                    'selfieImgStatus': 0,
                    'user_id': req.userId,
                    'kycType': req.body.kycType
                  }
                  kycTbl.create(object, (err, insertData) => {
                    if (!err && insertData) {
                      callback(true);
                    } else {
                      callback(false);

                    }
                  });
                })
              }
            })
          }
        })
      }

  }
  else {
    res.json({ "status": false, "msg": "please upload all fields" })
  }
}

function updateKyc(req, callback) {
  var imgArray = [];
  if (Object.keys(req.files).length > 0) {
    var kycValid =  kycTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), kyc_status: 0 }).countDocuments();
    

      if (req.files['frontImg'] != null || req.files['frontImg'] != undefined || req.files['frontImg'] != "") {
        var frontImgLink = req.files['frontImg'][0]
        s3bucket.uploadImage(frontImgLink, async function (imgRes) {
          var frontImg = imgRes.Location;
          if (req.files['backImg'] != null || req.files['backImg'] != undefined || req.files['backImg'] != "") {
            var backImgLink = req.files['backImg'][0]
            s3bucket.uploadImage(backImgLink, async function (imgRes) {
              var backImg = imgRes.Location;
              if (req.files['selfieImg'] != null || req.files['selfieImg'] != undefined || req.files['selfieImg'] != "") {
                var selfieImgLink = req.files['selfieImg'][0]
                s3bucket.uploadImage(selfieImgLink, async function (imgRes) {
                  var selfieImg = imgRes.Location;
                
                  if (imgRes.Location) {

                    var orgName = imgRes.key;
                    var explode = orgName.split('.');
                    var filename = explode[1];
        
                    imgArray[filename] = imgRes.Location;
        
                    uploaded = uploaded + 1;
        
                    if (imgRes.Location) {
        
                      let status = filename + 'Status';
        
                      let update = await kycTbl.updateOne({ user_id: mongoose.mongo.ObjectId(req.userId) }, { $set: { [filename]: imgRes.Location, [status]: 1 } });
                    
        
                    if (update) {
        
                      callback(true);
                    }}
        
                  } else {
        
                    uploaded = uploaded + 1;
                  }



                })
              }
            })
          }
        })
      }
 
  }
  else {
    res.json({ "status": false, "msg": "please upload all fields" })
  }





  if (req.files.length > 0) {

    let len = req.files.length;

    var uploaded = 0;

    for (i = 0; i < len; i++) {

      const fsize = req.files[i].size;

      const file = Math.round((fsize / 1024));

      if (file <= 1000) {

        s3bucket.uploadImage(req.files[i], async function (imgRes) {

          if (imgRes.Location) {

            var orgName = imgRes.key;
            var explode = orgName.split('.');
            var filename = explode[1];

            imgArray[filename] = imgRes.Location;

            uploaded = uploaded + 1;

            if (imgRes.Location) {

              let status = filename + 'Status';

              let update = await kycTbl.updateOne({ user_id: mongoose.mongo.ObjectId(req.userId) }, { $set: { [filename]: imgRes.Location, [status]: 1 } });
            }

            if (len == uploaded) {

              callback(true);
            }

          } else {

            uploaded = uploaded + 1;
          }

        });

      } else {

        uploaded = uploaded + 1;
      }
    }
  } else {

    callback(false);
  }



}

exports.submitKyc = async (req, res) => {
  try {
    imgArray=[];
    var uploaded = 0;

    if (Object.keys(req.files).length > 0) {
      var kycValid = await kycTbl.find({ user_id: mongoose.mongo.ObjectId(req.userId), kyc_status: 0 }).countDocuments();
      var kycValid2 = await usersTbl.findOne({ _id: mongoose.mongo.ObjectId(req.userId)})
      if (kycValid == 0) {
        if (req.files['frontImg'] != null || req.files['frontImg'] != undefined || req.files['frontImg'] != "") {
          var frontImgLink = req.files['frontImg'][0]
          s3bucket.uploadImage(frontImgLink, async function (imgRes) {
            var frontImg = imgRes.Location;
            if (req.files['backImg'] != null || req.files['backImg'] != undefined || req.files['backImg'] != "") {
              var backImgLink = req.files['backImg'][0]
              s3bucket.uploadImage(backImgLink, async function (imgRes) {
                var backImg = imgRes.Location;
                if (req.files['selfieImg'] != null || req.files['selfieImg'] != undefined || req.files['selfieImg'] != "") {
                  var selfieImgLink = req.files['selfieImg'][0]
                  s3bucket.uploadImage(selfieImgLink, async function (imgRes) {
                    var selfieImg = imgRes.Location;
                    let object = {
                      'frontImg': frontImg,
                      'backImg': backImg,
                      'selfieImg': selfieImg,
                      'frontImgStatus': 0,
                      'backImgStatus': 0,
                      'selfieImgStatus': 0,
                      'user_id': req.userId,
                      'kycType': req.body.kycType
                    }
                    kycTbl.create(object, (err, insertData) => {
                      if (!err && insertData) {
                        res.json({ status: true, msg: 'Your kyc has been submitted successfully.' });
                      } else {
                        res.json({ status: false, msg: 'Your kyc submission has been failed.' });
                      }
                    });
                  })
                }
              })
            }
          })
        }
      }

      else if(kycValid2.kyc_status==2){
        if (req.files['frontImg'] != null || req.files['frontImg'] != undefined || req.files['frontImg'] != "") {
          var frontImgLink = req.files['frontImg'][0]
          s3bucket.uploadImage(frontImgLink, async function (imgRes) {
            var frontImg = imgRes.Location;
            if (req.files['backImg'] != null || req.files['backImg'] != undefined || req.files['backImg'] != "") {
              var backImgLink = req.files['backImg'][0]
              s3bucket.uploadImage(backImgLink, async function (imgRes) {
                var backImg = imgRes.Location;
                if (req.files['selfieImg'] != null || req.files['selfieImg'] != undefined || req.files['selfieImg'] != "") {
                  var selfieImgLink = req.files['selfieImg'][0]


                  s3bucket.uploadImage(selfieImgLink, async function (imgRes) {
                    var selfieImg = imgRes.Location;
                    if (imgRes.Location) {
  
                      var orgName = imgRes.key;
                      var explode = orgName.split('.');
                      var filename = explode[1];
          
                      imgArray[filename] = imgRes.Location;
          
                      uploaded = uploaded + 1;
          
                      if (imgRes.Location) {
          
                        let status = filename + 'Status';
          
                        let update = await kycTbl.updateOne({ user_id: mongoose.mongo.ObjectId(req.userId) }, { $set: { frontImgStatus:0,backImgStatus:0,selfieImgStatus:0,frontImg:frontImg ,backImg: backImg,selfieImg: selfieImg, [status]: 0 } });
                        let update2 = await usersTbl.updateOne({ _id: mongoose.mongo.ObjectId(req.userId) }, { $set: { kyc_status:0 } });
          
                      if (update) {
                        
                      res.json({ status: true, msg: 'Your kyc has been re-submitted successfully.' });
                        }  else {
                            res.json({ status: false, msg: 'Your kyc re-submission has been failed.' });
                          }
 
                      }
          
                    } else {
          
                      uploaded = uploaded + 1;
                    }
  
  
  
                  })
                 



                }
              })
            }
          })
        }
      } 
      else {
        res.json({ "status": false, "msg": "your kyc verification has been processed!" })
      }
    }
    else {
      res.json({ "status": false, "msg": "please upload all fields" })
    }
  }
  catch (err) {
    
  }
}



