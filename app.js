require('dotenv').config();

var express                 = require('express');
path                        = require('path');
var bodyParser              = require('body-parser');
var helmet                  = require('helmet');
const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
    windowMs: 10*60*1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying — full speed until the max limit is reached
});
var routesApi = require('./server/routes/index');
var app = express();
app.disable('x-powered-by');
//sentiment testing
app.use(helmet());
app.use(limiter);

// app.use(express.static(__dirname + '/resources'));
app.set('view cache', true);
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'A Simple URL shortener' })
});
app.use('/api', routesApi);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

port = process.env.PORT ? process.env.PORT : 3000;
app.set('port', port);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});