let mongoose = require('mongoose');
let schema = mongoose.Schema;

let db= require('../database_configuration');

let comments_model = new schema({
    created_at: {
        type:Date
    },
    updated_at:{
        type:Date
    },
    comment:{
        type: String,
        trim:true,
        required: true,
    },
    commentedBy:{
        type: String,
        required:true},
    isDeleted:{
        type:Boolean,
        default: false
    },
    replyTo:{
        type:String,
        required:true
    },
    photoId:{
        type:String,
        required:true
    }

});


comments_model.pre('save', function(next) {

    var currentDate = new Date();


    this.updated_at = currentDate;


    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


let comments = db.model('comments', comments_model);

module.exports = comments;
