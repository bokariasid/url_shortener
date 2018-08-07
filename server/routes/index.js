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
	var base58Id = req.params.encoded_id;
	var id = base58.decode(base58Id);
	var ua = req.headers['user-agent'],
	    details = {};

	if (/mobile/i.test(ua)){
	    details.Mobile = true;
	}
	if (/like Mac OS X/.test(ua)) {
	    details.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
	    details.iPhone = /iPhone/.test(ua);
	    details.iPad = /iPad/.test(ua);
	}
	if (/Android/.test(ua)){
	    details.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
	}
	if (/webOS\//.test(ua)){
	    details.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
	}
	if (/(Intel|PPC) Mac OS X/.test(ua)){
	    details.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
	}
	if (/Windows NT/.test(ua)){
	    details.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
	}
	// check if url already exists in database
	Url.findOne({_id: id}, (err, doc) => {
		if (doc) {
			if(doc.user_details){
				delete req.device.parser;
				let userDetailsObject = {
					ip:req.headers['x-real-ip'],
					forwarded:req.headers['x-forwarded-for'],
					userAgent:req.headers['user-agent'],
					cookie:req.headers['cookie'],
					device:req.device
				};
				if(!validate.isEmpty(details)){
					userDetailsObject.deviceDetails = details;
				}
				doc.user_details.push(userDetailsObject)
				Url.findOneAndUpdate({_id: id}, {$set:{user_details:doc.user_details}}, {new:true}, (err, doc) => {});
				// doc.save();
			}
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
			shortUrl = config.webhost + 'api/' + base58.encode(doc._id);
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
				shortUrl = config.webhost + 'api/' + base58.encode(newUrl._id);
				return sendJSONresponse(res, 200, {'shortUrl': shortUrl});
			});
		}
	});
});

router.post('/:encoded_id', (req, res) => {
	var base58Id = req.params.encoded_id;
	var id = base58.decode(base58Id);
	// check if url already exists in database
	Url.findOne({_id: id}, (err, doc) => {
		if (doc){
			return sendJSONresponse(res, 200, {user_details: doc.user_details});
		} else {
			// since it doesn't exist, let's go ahead and create it:
			res.redirect(config.webhost);
		}
	});
});

module.exports = router;