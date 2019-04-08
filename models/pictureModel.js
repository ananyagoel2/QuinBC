let mongoose = require('mongoose');
let schema = mongoose.Schema;

let db= require('../database_configuration');

let picture_model = new schema({
    created_at: {
        type:Date
    },
    updated_at:{
        type:Date
    },
    path:{
        type: String,
        trim:true,
        required: true,
    },
    userId:{
        type: String,
        required:true},
    isDeleted:{
        type:Boolean,
        default: false
    }

});


picture_model.pre('save', function(next) {

    var currentDate = new Date();


    this.updated_at = currentDate;


    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


let picture = db.model('picture', picture_model);

module.exports = picture;
