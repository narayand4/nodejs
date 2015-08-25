/*
* Session Routes
*/
var express = require('express');
var router = express.Router();
var users = require('../data/users');

router.get('/signin', function(req, res) {
	res.render('sessions/signin', {title: "Log in"});
});

router.get('/user', function(req, res) {
	res.render('sessions/user', {title: "Log in"});
});

router.post('/', function(req, res) {
	console.log(users[req.body.username].password);
	if (users[req.body.username] && users[req.body.username].password === req.body.password) {
		req.session.user = users[req.body.username];
		res.render('../index.jade', {title: 'Express js'});
	} else {
		res.redirect('/sessions/new')
	}
});

/*router.del('/', function(req, res, next) {
	req.session.destroy();
	res.redirect('/users');
});*/

module.exports = router;