const express   = require('express');
const mongoose  = require('mongoose');
const usersTbl  = require('../mdlhysreyh/usrscdsfgesdg');
const depositTbl      = require('../mdlhysreyh/dylyonj');
const withdrawTbl      = require('../mdlhysreyh/wdidrth');
const transferTbl      = require('../mdlhysreyh/tsilrefsnart');


exports.Hash_Details = async (req,res) => {
    try{
        
        depositTbl.findOne({ approvehash })
        

      
    }catch(e){
      res.json({status:false,msg:'Something went wrong ' + e});
    }
  }
  