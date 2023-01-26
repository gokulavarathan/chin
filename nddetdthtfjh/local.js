// const _0x1ded01=_0x5daf;function _0x222b(){const _0x2a4f69=['readFileSync','2591880zGalom','27pPTkEx','hbfxdsflbbn','34284GdChnz','341UZaeCn','991664de353df142fc76e4882de388f50d7c97476359a3dd9a23','1137uPGsgX','3528210OkBoig','3582FLIuHL','osiztech.crt','10912kfXpPf','22zuoouB','7EdpMgu','3653ufZSEJ','4570854kzTjIi','osiztech.key','../hprftghftgj/encvdsgvds','2844232YHJsxJ','exports','http','decrypt'];_0x222b=function(){return _0x2a4f69;};return _0x222b();}(function(_0x53d460,_0x2e3b0c){const _0x3cd4b0=_0x5daf,_0x16eabb=_0x53d460();while(!![]){try{const _0xe3d52=-parseInt(_0x3cd4b0(0xfb))/0x1*(parseInt(_0x3cd4b0(0xe9))/0x2)+-parseInt(_0x3cd4b0(0xe7))/0x3*(-parseInt(_0x3cd4b0(0xeb))/0x4)+parseInt(_0x3cd4b0(0xe8))/0x5+-parseInt(_0x3cd4b0(0xef))/0x6*(parseInt(_0x3cd4b0(0xed))/0x7)+parseInt(_0x3cd4b0(0xf2))/0x8*(-parseInt(_0x3cd4b0(0xf8))/0x9)+parseInt(_0x3cd4b0(0xf7))/0xa*(parseInt(_0x3cd4b0(0xec))/0xb)+parseInt(_0x3cd4b0(0xfa))/0xc*(parseInt(_0x3cd4b0(0xee))/0xd);if(_0xe3d52===_0x2e3b0c)break;else _0x16eabb['push'](_0x16eabb['shift']());}catch(_0x58469f){_0x16eabb['push'](_0x16eabb['shift']());}}}(_0x222b,0x97c34));function _0x5daf(_0x1c0391,_0x16a74b){const _0x222b4c=_0x222b();return _0x5daf=function(_0x5dafd3,_0x46b9ce){_0x5dafd3=_0x5dafd3-0xe7;let _0x5d42a7=_0x222b4c[_0x5dafd3];return _0x5d42a7;},_0x5daf(_0x1c0391,_0x16a74b);}let encrypter=require(_0x1ded01(0xf1));const fs=require('fs');module[_0x1ded01(0xf3)]={'dbConnection':'mongodb://192.168.1.79:15934/GhvjBCtdecfTDRSDeifjvnVN','port':0x822,'serverType':_0x1ded01(0xf4),'serverOptions':{'key':fs[_0x1ded01(0xf6)](_0x1ded01(0xf0)),'cert':fs[_0x1ded01(0xf6)](_0x1ded01(0xea))},'cryptoKey':encrypter[_0x1ded01(0xf5)]('991664de353df142fc76e4882de388f50d7c95546a629cdbbe5645'),'cryptoIv':encrypter[_0x1ded01(0xf5)](_0x1ded01(0xfc)),'jwtTokenAdmin':_0x1ded01(0xf9),'dbPrefix':encrypter['decrypt']('f9307c')};


let encrypter = require('../hprftghftgj/encvdsgvds');

module.exports = {
    dbConnection:"mongodb://192.168.1.79:15934/GhvjBCtdecfTDRSDeifjvnVN" ,
    port:5076,
    serverType: 'http',
    serverOptions: {},
    cryptoKey: encrypter.decrypt('991664de353df142fc76e4882de388f50d7c95546a629cdbbe5645'),
    cryptoIv: encrypter.decrypt('991664de353df142fc76e4882de388f50d7c97476359a3dd9a23'),
    jwtTokenAdmin:"hbfxdsflbbn",
}