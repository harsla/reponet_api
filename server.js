/*jslint node: true es5: true nomen: true*/
"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser());

var port = process.env.PORT || 1337,
    mongoose = require('mongoose'),
    User = require('./app/models/user');
mongoose.connect('mongodb://localhost/testAPI');

var router = express.Router();
router.use(function (req, res, next) {
	// do logging
	next();
});

router.get('/', function (req, res) {
	res.json({ message: 'repoNet API v1' });
});

// CRUD:
router.route('/users')
	.post(function (req, res) {
		
		var user = new User();		// create a new instance of the user model
		user.name = req.body.name;  // extract the user's 'name' from the request

		user.save(function (err) {
			if (err) {
				res.send(err);
            }
			res.json({ message: 'User ' + user.name + ' created!' });
		});

		
	})

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function (req, res) {
		User.find(function (err, users) {
			if (err) {
				res.send(err);
            }
			res.json(users);
		});
	});

// on routes that end in /users/:user_id
router.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    })

	// update the user with this id
	.put(function (req, res) {
		User.findById(req.params.user_id, function (err, user) {

			if (err) {
				res.send(err);
            }
			user.name = req.body.name;
			user.save(function (err) {
				if (err) {
					res.send(err);
                }
				res.json({ message: 'User updated!' });
			});

		});
	})

	// delete the user with this id
	.delete(function (req, res) {
		User.remove({
			_id: req.params.user_id
		}, function (err, user) {
			if (err) {
				res.send(err);
            }
			res.json({ message: 'User successfully deleted' });
		});
	});


// register routs
app.use('/api', router);

// vroom
app.listen(port);
console.log('Magic happens on port ' + port);
