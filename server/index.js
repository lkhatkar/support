const path = require('path');
// require('dotenv/config');
require('dotenv').config({ 
    path: path.resolve(__dirname, `./config/${process.env.ENV || 'prod'}.env`)
});

module.exports = require('./server');