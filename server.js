/*jslint node: true es5: true nomen: true*/
"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    jwauth = require('./jwtauth.js'),
    app = express();

app.use(bodyParser());
app.set('jwtTokenSecret', 'AlsrahEiramNir');

var requireAuth = function(req, res, next) {
	if (!req.user) {
		res.end('Not authorized', 401)
	}	else {
		next();
	}
}

var port = process.env.PORT || 1337,
    mongoose = require('mongoose'),
    User = require('./app/models/user');
mongoose.connect('mongodb://localhost/testAPI');

var router = express.Router();
router.use(function (req, res, next) {
	// do logging
	next();
});

router.get('/', jwauth, requireAuth, function (req, res) {
	res.json({ message: 'Welcome, ' + req.user.username});
});

router.route('/auth')
    .get(function (req, res) {
        console.log(req.headers.username);
        
        //auth here
        User.findOne({ username: req.headers.username }, function (err, user) {
          if (err) { 
            // user not found 
            return res.send(401);
          }

          if (!user) {
            // incorrect username
            return res.send(401);
          }

//          if (!user.validPassword(password)) {
//            // incorrect password
//            return res.send(401);
//          }

          // User has authenticated OK
            var expires = moment().add('days', 1).valueOf();
            var token = jwt.encode({
              iss: user.id,
              exp: expires
            }, app.get('jwtTokenSecret'));

            res.json({
              token : token,
              expires: expires,
              user: user.toJSON()
            });
            res.send(200);
        });
    });

router.route('/users')
	.post(function (req, res) {
		var user = new User();
		
        user.username = req.body.username;  // extract the user's 'name' from the request
        //password_hash: String,
        //password_salt: String,
        user.type = req.body.type; //TODO: Set the default type to user - must be promoted to become anything else
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
		
        user.save(function (err) {
			if (err) { res.send(err); }
			res.json({ message: 'User ' + user.name + ' created!' });
		});
	})

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(jwauth, requireAuth, function (req, res) {
		User.find(function (err, users) {
			if (err) { res.send(err); }
			res.json(users);
		});
	});

// on routes that end in /users/:user_id
router.route('/users/:user_id')
    .get(jwauth, requireAuth, function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) { res.send(err); }
            res.json(user);
        });
    })

	// update the user with this id
	.put(jwauth, requireAuth, function (req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) { res.send(err); }
			user.name = req.body.name;
			user.save(function (err) {
				if (err) { res.send(err); }
				res.json({ message: 'User updated!' });
			});
		});
	})

	// delete the user with this id
	.delete(jwauth, requireAuth, function (req, res) {
		User.remove({
			_id: req.params.user_id
		}, function (err, user) {
			if (err) { res.send(err); }
			res.json({ message: 'User successfully deleted' });
		});
	});

// register routs
app.use('/api', router);

// vroom
app.listen(port);
console.log('Magic happens on port ' + port);