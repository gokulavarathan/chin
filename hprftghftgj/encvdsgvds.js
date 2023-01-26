const crypto = require('crypto');
let algorithm = 'aes-256-ctr';
let password = 'StCaErRaZaBnIoK2122TOSCD1S2N3A4E';
let iv = 'K102I3n4aZbYCxDw';

module.exports = {
encrypt: function(value){
    let cipher = crypto.createCipheriv(algorithm, password, iv);
    let crypted = cipher.update(value, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
},
decrypt: function(value){
    let decipher = crypto.createDecipheriv(algorithm, password, iv)
    let dec = decipher.update(value, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
};