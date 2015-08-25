var express = require('express');
var router = express.Router();
var users = require('../data/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('users/index', { title: 'Users List',users: users });
});

/* Get user add. */
router.get('/create', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('users/create', { title: 'Create User' });
});

/* user update. */
router.get('/update/:name', function(req, res, next){
	var user = users[req.params.name];
	console.log(user);
	if (user) {
		res.render('users/update', {title: 'Update User', user: user});
	} else {
		next();
	}
});

/* POST user add. */
router.post('/create', function(req, res) {
	if (users[req.body.username]) {
		res.send('Conflict', 409);
	} else {
		users[req.body.username] = req.body;
		res.redirect('/users');
	}
});

/* POST user update. */
router.post('/update/:name', function(req, res) {
	if (users[req.body.username]) {
		users[req.body.username] = req.body;
		res.redirect('/users');		
	} else {
		res.send('Conflict', 409);
	}
});

module.exports = router;
