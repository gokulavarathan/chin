const mongoose = require('mongoose');
const config = require('../nddetdthtfjh/config');

mongoose.connect(config.dbConnection)
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.error(err));

mongoose.connection.on('connected', function () {
    console.log('Front Mongoose default connection open');
});

mongoose.connection.on('error', function (err) {
    console.log('Front Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Front Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Front Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

require('./usrscdsfgesdg');
require('./klkrqew');
require('./cixdnxr');
require('./bunotsp');
require('./dylyonj');
require('./adxnygj');
require('./knabledom');
require('./epitsipa');

