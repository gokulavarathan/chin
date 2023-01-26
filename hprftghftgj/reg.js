const adminSchema = require('../mdlhysreyh/adscdrgdsf')
var bcrypt = require('bcryptjs');




//register

 const regst=(req, res,next) => {
  
try {
  encryptedPassword =  bcrypt.hash("chinTwo2@", 10);

var adminData= new adminSchema ({

  username:"admin123",
  email:"admin@gmail.com",
  password:encryptedPassword
}) 
adminData.save();
res.json(adminData)
  
    
  } catch (err) {
    
  }
 
};
