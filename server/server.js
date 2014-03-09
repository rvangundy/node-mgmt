'use strict';

var express = require('express');
var server  = express();
var port    = process.env.PORT || 53978;

require('./api')(server);
require('./app')(server, { debug : true });

server.listen(port);

console.log('listening on port ' + port);

module.exports = server;
