/*jslint node: true es5: true nomen: true*/
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    password_hash: String,
    password_salt: String,
    type: String,
    email: String,
    firstname: String,
    lastname: String
});

module.exports = mongoose.model('User', UserSchema);