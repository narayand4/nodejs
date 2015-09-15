var File = require('../models/file');
exports.index = function(req, res, next) {
	File.getByUserId(req.session.userId, function(err, files) {
		if (err) { return next(err); }
		res.render('files/index', {
			username: req.session.username,
			files: files,
			info: req.flash('info')[0],
			error: req.flash('error')[0]
		});
	});
};
exports.show = function(req, res, next) {
	var file = new File(req.session.userId, req.params.file);
	file.exists(function(exists) {
		if (!exists) { return res.send(404, 'Page Not Found'); }
		res.sendfile(file.path);
	});
};
exports.destroy = function(req, res, next) {
	var file = new File(req.session.userId, req.params.file);
	file.delete(function(err) {
		if (err) { return next(err); }
		req.flash('info', 'File successfully deleted!');
		res.redirect('/');
	});
};
exports.create = function(req, res, next) {
	if (!req.files.file || (req.files.file.size === 0)) {
		req.flash('error', 'No file selected!');
		return res.redirect('/');
	}
	var file = new File(req.session.userId, req.files.file.
	originalFilename);
	file.save(req.files.file.path, function(err) {
		if (err) { return next(err); }
		req.flash('info', 'File successfully uploaded!');
		res.redirect('/');
	});
};