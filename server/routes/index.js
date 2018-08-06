var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var base58 = require('../base58.js');

// grab the url model
var Url = require('../models/url');
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

router.get('/:encoded_id', async (req, res) => {
	// route to redirect the visitor to their original URL given the short URL
});

router.post('/short', async (req, res) => {
	return sendJSONresponse(res, 200, {short_url:"http://www.google.com"});
});

router.get('/short/details', async (req, res) => {
	return sendJSONresponse(res, 200, {message:"HELLO WORLD"});
});

module.exports = router;