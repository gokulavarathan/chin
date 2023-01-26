const mongoose = require('mongoose');
const dbconfig = require('../mdlhysreyh/db');

exports.findoneData = (collection_name, where, gets, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        getlen = Object.keys(gets).length;
        if(getlen > 0){
            collection.findOne({"$query":where, "$orderby":{"_id":-1}}, gets).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else{
            collection.findOne({"$query":where, "$orderby":{"_id":-1}}).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }
    }catch(err){
        
        callback(false);
    }
}

exports.findData = (collection_name, where, gets, sorts, limit, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        let sortlen = Object.keys(sorts).length;
        if(sortlen != 0 && limit != 0){
            collection.find(where, gets).sort(sorts).limit(limit).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else if(sortlen != 0){
            collection.find(where, gets).sort(sorts).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else if(limit != 0){
            collection.find(where, gets).limit(limit).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else{
            collection.find(where, gets).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }
    }catch(err){
        
        callback(false);
    }
}

exports.insertData = (collection_name, values, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        let valuelen = Object.keys(values).length;
        if(valuelen > 0){
            collection.create(values, (error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else{
            callback(false);
        }
    }catch(err){
        
        callback(false);
    }
}

exports.updateData = (collection_name, updatetype,  where, values, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        if(updatetype == "one"){
            collection.updateOne(where, {"$set":values}).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else{
            collection.updateMany(where, {"$set":values}).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }
    }catch(err){
        
        callback(false);
    }
}

exports.deleteData = (collection_name, deletetype, where, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        if(deletetype == "one"){
            collection.deleteOne(where).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }else{
            collection.deleteMany(where).exec((error, resdata)=>{
                if(resdata){
                    callback(resdata);
                }else{
                    callback(false);
                }
            })
        }
    }catch(err){
        
        callback(false);
    }
}

exports.findCount = (collection_name, where, callback)=>{
    try{
        let collection;
        collection = mongoose.model(collection_name);
        collection.find(where).countDocuments().exec((error, countdata)=>{
            if(countdata){
                callback(countdata);
            }else{
                callback(0);
            }
        })
    }catch(err){
        
        callback(0);
    }
}