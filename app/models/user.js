/*jslint node: true es5: true nomen: true*/
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('User', UserSchema);