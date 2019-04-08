var express = require('express');
var router = express.Router();

var user_model = require('../models/userModel');

var express = require('express');
var _ = require('lodash');

var router = express.Router();

router.route('/')
    .post(function (req, res) {
        user_model.findOne({email: req.body.email})
            .select('+password')
            .then(function (user) {
                user.compare_password(req.body.password, function (err, is_match) {
                    if (is_match) {
                        var user_updated=_.omit(user.toObject(),'password');

                        res.status(200).send({
                            user: user_updated} )
                    }
                    else {
                        res.status(400).send({error: "Credentials don't match"})
                    }
                })
            })
            .catch(function () {
                res.status(404).send({error: "email not found"})
            })
    })

module.exports = router;
