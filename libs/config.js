/*jslint node: true es5: true nomen: true*/
"use strict";

var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;