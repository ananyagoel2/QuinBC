var express = require('express');
var router    = express.Router();
let mongoose = require('mongoose');
let Objectid = mongoose.Types.ObjectId;
let comment_model     = require('../models/comments');
let arrayToTree = require('array-to-tree');


router.post('/:photoId', function (req,res) {

    let comment = new comment_model({
        comment: req.body.comment,
        commentedBy: req.body.commentedBy,
        replyTo: req.body.replyTo || null,
        photoId:req.params.photoId
    })
    if(req.body.replyTo === undefined || req.body.replyTo === null){
        comment.save((error, result)=>{
            if(error){

                res.status(500)
                    .send({
                        error:error
                    })
            }else{
                let io = req.app.get('socketio');
                io.emit('comment', { data: result });
                res.status(200)
                    .send({
                        success:true,
                        data:result
                    })
            }
        })
    }else{
        comment_model.count({
            isDeleted:false,
            _id:new Objectid(req.body.replyTo)
        }).then((data)=>{
            if(data===1){
                comment.save((error, result)=>{
                    if(error){

                        res.status(500)
                            .send({
                                error:error
                            })
                    }else{
                        let io = req.app.get('socketio');
                        io.emit('comment', { data: result });
                        res.status(200)
                            .send({
                                success:true,
                                data:result
                            })
                    }
                })
            }else{
                res.status(400)
                    .send({
                        error:"comment not found",

                    })
            }
        })
    }


})

router.delete('/:commentId', function (req, res) {
    comment_model.update({replyTo:req.params.commentId},{
            $set:{
                isDeleted: true
            }
        }
    ).then((data)=>{
        comment_model.findByIdAndUpdate(req.params.commentId,{
            $set:{
                isDeleted:true
            }
        }).then((deletedmain)=>{
            res.send({
                success:true})
        }).catch((error)=>{
            res.status(500).send({success:false,
                error:error})
        })
    }).catch((error)=>{
        res.status(500).send({success:false,
            error:error})
    })
})

router.get('/:photoId', function (req, res) {
    comment_model.find({
    photoId:  req.params.photoId,
        isDeleted: false

    }).lean()
        .exec((error, data)=>{
            if(error){
                res.status(500).send(
                    {
                        error:error
                    }
                )
            }else{
                data = JSON.parse(JSON.stringify(data, null, '\t'));
                console.log(data);
                res.status(200)
                    .send({
                        success:true,data: arrayToTree(data,{
                            customID:'_id',
                            parentProperty:'replyTo',
                            replies: 'replies'
                        })
                    })
            }
        })
})

module.exports = router;


