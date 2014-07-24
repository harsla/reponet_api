/*jslint node: true es5: true nomen: true*/
"use strict";

var express = require('express'),
    url = require('url'),
    bodyParser = require('body-parser'),
    jwt = require('jwt-simple'),
    UserModel = require('./app/models/user'),
    app = express();

 
module.exports = function (req, res, next) {

	// Parse the URL, we might need this
	var parsed_url = url.parse(req.url, true),
        token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
	/**
	 * Take the token from:
	 * 
	 *  - the POST value access_token
	 *  - the GET parameter access_token
	 *  - the x-access-token header
	 *    ...in that order.
     *  app.get('jwtTokenSecret'))
	 */
    if (token) {
		try {
            var decoded = jwt.decode(token, 'AlsrahEiramNir');
			if (decoded.exp <= Date.now()) {
				res.end('Access token has expired', 400);
			}
			UserModel.findOne({ '_id': decoded.iss }, function (err, user) {

				if (!err) {
					req.user = user;
					return next();
				}
			});
		} catch (err) {
            console.log('error:', err);
			return next();
		}
	} else {
		next();
	}
};