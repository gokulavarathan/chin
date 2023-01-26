const express = require('express');
const mongoose = require('mongoose');
const mailfn = require('../hprftghftgj/laimsd');
const common = require('../hprftghftgj/nommoc.js');
var async = require("async");

const usersTbl = require('../mdlhysreyh/usrscdsfgesdg');
const mailTemplateTbl = require('../mdlhysreyh/xjgvvna');
proposalDB = require('../mdlhysreyh/prlasoporp');
proposalVoteDB = require('../mdlhysreyh/pretovlasop');

//PROPOSAL - ADD
exports.addProposal = async (req, res) => {
    const { title, content } = req.body;
    var user_id = mongoose.mongo.ObjectId(req.userId);
    

    if (!title) {
        res.json({
            status: false,
            msg: "Title is required!"
        })
    } else if (!content) {
        res.json({
            status: false,
            msg: "Content is required!"
        })
    } else {
        proposalDB.create({
            "title": title,
            "content": content,
            "votes.positive": 0,
            "votes.negative": 0,
            "votes.total": 0
        }, (err, created) => {
            if (!err && created) {
                res.json({
                    status: true,
                    msg: "Proposal added successfully",
                    data: created
                })
                res.end()
            }
            else {
                res.json({
                    status: false,
                    msg: "something went wrong!"
                })
                res.end()
            }
        })
    }
}

exports.voteProposal = async (req, res) => {
    try {
        const proposal_id = req.body._id
        const { voteStatus } = req.body
        let user_id = mongoose.Types.ObjectId(req.user_id);
        proposalDB.findOne({ "_id": proposal_id }, (err, proposalData) => {
            if (!err && proposalData != null) {
                proposalVoteDB.findOne({ "proposalId": proposal_id }, (err, voteHistory) => {
                    proposalVoteDB.findOne({ "proposalId": proposal_id, "history.userId": user_id }, { history: 1 }, (err, existesVote) => {
                        if (!err && existesVote == null) {
                            if (voteStatus == "true" || voteStatus == "false") {
                                var vote = proposalData.votes;
                                if (voteStatus == "true") {
                                    
                                    proposalDB.updateOne({ "_id": proposalData._id }, {
                                        $set: {
                                            "votes.positive": vote.positive + 1,
                                            "votes.total": vote.total + 1,
                                        }
                                    }, (err, updated) => {
                                        if (!err && updated) {
                                            if (voteHistory == null) {
                                                let voteDetails = {
                                                    proposalId: proposal_id,
                                                    history: [{
                                                        userId: user_id,
                                                        vote: "positive",
                                                        voteStatus: voteStatus
                                                    }]
                                                }
                                                proposalVoteDB.create(voteDetails, (err, voteData) => {
                                                    if (!err && voteData) {
                                                        res.json({
                                                            status: true,
                                                            msg: "success",
                                                            data: voteData
                                                        });
                                                        res.end();
                                                    }
                                                    else {
                                                        res.json({
                                                            status: 400,
                                                            msg: "error",
                                                            data: err
                                                        });
                                                        res.end()
                                                    }
                                                })
                                            }
                                            else {
                                                let voteDetails = {
                                                    userId: user_id,
                                                    vote: "positive",
                                                    voteStatus: voteStatus
                                                }
                                                proposalVoteDB.updateOne({ "_id": voteHistory._id }, {
                                                    $push: {
                                                        history: voteDetails
                                                    }
                                                }, (err, updated) => {
                                                    if (!err && updated) {
                                                        
                                                        res.json({
                                                            status: true,
                                                            msg: "success",
                                                            data: updated
                                                        });
                                                        res.end();
                                                    }
                                                    else {
                                                        
                                                        res.json({
                                                            status: 400,
                                                            msg: "error",
                                                            data: err
                                                        });
                                                        res.end()
                                                    }
                                                })
                                            }
                                        } else {
                                            
                                        }
                                    });
                                } else {
                                    proposalDB.updateOne({ "_id": proposalData._id }, {
                                        $set: {
                                            "votes.negative": vote.negative + 1,
                                            "votes.total": vote.total + 1,
                                        }
                                    }, (err, updated) => {
                                        if (!err && updated) {
                                            if (voteHistory == null) {
                                                let voteDetails = {
                                                    proposalId: proposal_id,
                                                    history: [{
                                                        userId: user_id,
                                                        vote: "negative",
                                                        voteStatus: voteStatus
                                                    }]
                                                }
                                                proposalVoteDB.create(voteDetails, (err, voteData) => {
                                                    if (!err && voteData) {
                                                        res.json({
                                                            status: true,
                                                            msg: "success",
                                                            data: voteData
                                                        });
                                                        res.end();
                                                    }
                                                    else {
                                                        res.json({
                                                            status: 400,
                                                            msg: "error",
                                                            data: err
                                                        });
                                                        res.end()
                                                    }
                                                })
                                            } else {
                                                let voteDetails = {
                                                    userId: user_id,
                                                    vote: "negative",
                                                    voteStatus: voteStatus
                                                }
                                                proposalVoteDB.updateOne({ "_id": voteHistory._id }, {
                                                    $push: { history: voteDetails }
                                                }, (err, voteData) => {
                                                    if (!err && voteData) {
                                                        res.json({
                                                            status: true,
                                                            msg: "success",
                                                            data: voteData
                                                        });
                                                        res.end();
                                                    }
                                                    else {
                                                        res.json({
                                                            status: 400,
                                                            msg: "error",
                                                            data: err
                                                        });
                                                        res.end()
                                                    }
                                                })
                                            }
                                        }
                                        else {
                                            
                                            res.json({
                                                status: false,
                                                msg: "something went wrong!"
                                            });
                                            res.end();
                                        }
                                    });
                                }
                            } else {
                                res.json({
                                    status: false,
                                    msg: "invalid inputs"
                                });
                                res.end();
                            }
                        } else {

                            res.json({
                                status: false,
                                msg: "you had already voted!"
                            });
                            res.end();
                        }
                    })
                })
            }
            else {
                res.json({
                    status: false,
                    msg: "no data found"
                });
                res.end();
            }
        })
    }
    catch (err) {
        
    }
}

// PROPOSALS - VIEW

exports.proposalsList = (req, res) => {

    try {
  
      let reqParam = req.body;
      let reqType = reqParam.type;
      let reqData = reqParam.payload;
  
      let pageNo = (reqData.page) ? reqData.page : '0';
      let pageSize = (reqData.pageSize) ? reqData.pageSize : '0';
      var skip = +pageNo * pageSize;
      var limit = +pageSize;
      var sort = { createdAt: -1 };
  
  
      async.parallel({
  
        proposalData: function (cb) {
  
            proposalDB.find({ "status": "active" }).skip(skip).limit(limit).sort(sort).exec(cb);
        },
  
        totalRecords: function (cb) {
  
            proposalDB.find({ "status": "active" }).countDocuments().exec(cb);
        }
  
      }, function (err, results) {
        var data = (results.totalRecords > 0) ? results.proposalData : [];
        var count = (results.totalRecords) ? results.totalRecords : 0;
  
        return res.json({ status: true, data: data, counts: count })
  
      })
  
    } catch (e) {
      return res.json({ status: false, msg: 'Something went wrong' });
    }
  }
  



exports.proposalVotesList = function (req, res) {
    var proposalId = req.body._id;
    if (!proposalId) {
        res.json({
            status: false,
            msg: "id is required",
            counts: votes,
            data: proposalVotes
        })
    } else {
        proposalDB.findOne({ "_id": proposalId }, (err, proposals) => {
    if (!err && proposals != null) {
            proposalVoteDB.findOne({ "proposalId": proposalId }, { "proposalId": 0, "_id": 0 }, (err, proposalVotes) => {
                if (!err && proposalVotes != null) {
                    
                    let votes = {
                        positiveVotes: proposals.votes.positive,
                        negativeVotes: proposals.votes.negative,
                        totalVotes: proposals.votes.total,
                        positivePercentage: `${(proposals.votes.positive / proposals.votes.total) * 100} %`,
                        negativePercentage: `${(proposals.votes.negative / proposals.votes.total) * 100} %`,
                    }
                    res.json({
                        status: true,
                        msg: "success",
                        counts: votes,
                        data: proposalVotes
                    })
                }else{
                    res.json({
                        status: false,
                        msg: "proposal does not have votes!",
                        counts: votes,
                        data: proposalVotes
                    })
                }
            })
        }else{
            res.json({
                status: false,
                msg: "proposal does not exists",
                counts: votes,
                data: proposalVotes
            })
        }
        })
    }
}