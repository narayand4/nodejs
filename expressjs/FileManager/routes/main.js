exports.requireUserAuth = function(req, res, next) {
	// redirect user to login page if they're not logged in
	if (!req.session.username) {
		return res.redirect('/sessions/new');
	}
	// needed in the layout for displaying the logout button
	res.locals.isLoggedIn = true;
	next();
};