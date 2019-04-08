var user_model = require('../models/userModel');
// var user_model = model.user;

var express = require('express');

var router = express.Router();

router.route('/')
    .post(function (req, res) {
        user_model.findOne({email:req.body.email},function (err, user) {
            if(err){
                res.status(400).send(err);
            }
            else{
                if(user)
                {
                    res.status(400).send({message:"email already taken!"})
                }
                else{
                    var new_user = user_model({
                        password:req.body.password,
                        email:req.body.email

                    });
                    new_user.save(function(err,user_added) {
                        if(err)
                        {
                            res.status('400').send(err);
                        }
                        else
                        {
                            res.status(200).send({
                                user: user_added,
                                success:true} )
                        }

                    })
                }
            }
        })
    });

module.exports = router;
