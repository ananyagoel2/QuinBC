var express = require('express');
var router    = express.Router();
var upload    = require('../utils/upload');
let mongoose = require('mongoose');
let Objectid = mongoose.Types.ObjectId;
var photo_model     = require('../models/pictureModel')


/** Upload file to path and add record to database */

router.post('/upload', function(req, res) {

    upload(req, res,(error) => {
        if(error){
            res.send(error);
        }else{
            if(req.file == undefined){

                res.send(error);

            }else{

                /**
                 * Create new record in mongoDB
                 */
                let fullPath = "files/"+req.file.filename;

                let document = {
                    path:     fullPath,
                    userId:   req.body.userId
                };

                let photo = new photo_model(document);
                photo.save(function(error, data){
                    if(error){
                        throw error;
                    }
                    res.status(200).send({
                        success:true,
                        result: data
                    })
                });
            }
        }
    });
});

router.delete('/upload/:id', function (req, res) {
    photo_model.findByIdAndUpdate(req.params.id,{
        $set:{
            isDeleted: true
        }
        }
    ).then((data)=>{
            res.send({
                success:true})

    }).catch((error)=>{
        res.status(500).send({success:false,
    error:error})
    })

})

router.get('/upload/:id', function (req, res) {
    photo_model.findOne({
        _id: new Objectid(req.params.id),
        isDeleted:false
    },{path:1,_id:0}).then((data)=>{
        if(data.length === 0){
            res.status(404).send({
                success:false
            })
        }else{
            // data = data.toJSON()
            res.send({
                path:data
            })
        }


    }).catch((error)=>{
        res.status(500).send({
            error:error,
            success:false
        })
    })
})

router.get('/user/:id', function (req, res) {
    photo_model.find({
        userId: req.params.id,
        isDeleted:false
    }).lean()
        .exec((error,data)=>{
            if(error){
                res.status(500).send(
                    {
                        error:error
                    }
                )
            }else{
                res.status(200).send(
                    {
                        data:data
                    }
                )
            }

    })
})

module.exports = router;
