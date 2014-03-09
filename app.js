/**
* Module dependencies.
*/
var express = require('express'),
    routes = require('./routes'),
    letter = require('./routes/letter'),
    index = require('./routes/index'),
    admin = require('./routes/admin'),
    http = require('http'),
    path = require('path'),
    mailer = require('express-mailer');

app = express(); // Global

// development only
if ('development' == app.get('env')) {
    app.basePath = "/Users/arein/node/letterapp";
} else {
    app.basePath = "/var/www/letterapp";
    console.log("Running production");
}

// all environments
app.use(express.limit('70mb'));
app.use(express.json({limit: '70mb'}));
app.use(express.urlencoded({limit: '70mb'}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

if ('development' == app.get('env')) {
    mailer.extend(app, {
      from: 'test@dev.ceseros.de',
      host: 'dev.ceseros.de', // hostname
      secureConnection: false, // use SSL
      port: 25, // port for secure SMTP
      transportMethod: 'SMTP' // default is SMTP. Accepts anything that nodemailer accepts
    });
} else {
    mailer.extend(app, {
        from: 'hello@milsapp.com',
        host: 'intern.ceseros.de', // hostname
        secureConnection: false, // use SSL
        port: 25, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: 'hello@milsapp.com',
            pass: 'Mk72TBbL'
        }
    });
}

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
});

// Synchronous Function
var auth = express.basicAuth(function(user, pass) {
    if (user === 'arein' && pass === 'Derek12345') return true;
    if (user === 'fehrhardt' && pass === 'Edmund') return true;
    
    return false;
});

app.get('/', index.index);
//app.get('/letters', letter.findAll);
app.get('/letters/calculate-price', letter.calculatePrice);
app.get('/admin', auth, admin.index);
//app.get('/letters/:id', letter.findById);
app.post('/letters/:id', letter.purchaseLetter);
app.post('/letters', letter.uploadLetter);
app.get('/downloads/osx', letter.osxDownload);
//app.put('/letters/:id', letter.updateLetter);
//app.delete('/letters/:id', letter.deleteLetter);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
