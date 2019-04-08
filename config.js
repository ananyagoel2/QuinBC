var Promise = require("bluebird");

var config = {};


config.url = "mongodb://localhost:27017/TestCase_q";

config.options={
    db: { native_parser: true },
    server: { poolSize: 5 },
    promiseLibrary: Promise
}



module.exports= config;
