var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var base58 = require('../base58.js');
var validate = require('validate.js');

// grab the url model
var Url = require('../models/url');
// var Counters = require('../models/counters');
var connectionString = 'mongodb://'+config.db.username+':'+config.db.password+'@'+ config.db.host +':'+config.db.port+'/' + config.db.name;
mongoose.connect(connectionString, { useNewUrlParser: true });

var sendJSONresponse = function(res, status, content, headers) {
    if(headers){
        console.log(headers);
    }
    res.status(status);
    res.json(content);
    res.end('ok');
};

router.get('/:encoded_id', (req, res) => {
	console.log('in here')
	var base58Id = req.params.encoded_id;
	var id = base58.decode(base58Id);
	// check if url already exists in database
	Url.findOne({_id: id}, (err, doc) => {
		if (doc) {
			res.redirect(doc.long_url);
		} else {
			res.redirect(config.webhost);
		}
	});
});

router.post('/short', function(req, res) {
	// route to redirect the visitor to their original URL given the short URL
	var constraint = {longUrl:{presence:true, url:true}};
	var validation_result = validate(req.body, constraint);
	if(validation_result){
		return sendJSONresponse(res, 406, validation_result);
	}
	var longUrl = req.body.longUrl;
	var shortUrl = '';
	// check if url already exists in database
	Url.findOne({long_url: longUrl}, (err, doc) => {
		if (doc){
			shortUrl = config.webhost + base58.encode(doc._id);
			// the document exists, so we return it without creating a new entry
			return sendJSONresponse(res, 200, {'shortUrl': shortUrl});
		} else {
			// since it doesn't exist, let's go ahead and create it:
			var newUrl = Url({
				long_url: longUrl
			});
			// save the new link
			newUrl.save((err) => {
				if (err){
					console.log(err);
				}
				shortUrl = config.webhost + base58.encode(newUrl._id);
				return sendJSONresponse(res, 200, {'shortUrl': shortUrl});
			});
		}
	});
});

router.get('/short/details', (req, res) => {
	return sendJSONresponse(res, 200, {message:"HELLO WORLD"});
});

module.exports = router;