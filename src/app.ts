/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../vendor/typescript-node-definitions/express3.d.ts'/>

/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes/index'),
    letter = require('./routes/letter'),
    index = require('./routes/index'),
    admin = require('./routes/admin'),
    http = require('http'),
    path = require('path'),
    mailer = require('express-mailer'),
    Poet = require('poet');

var app = module.exports = express(); // Global

// development only
if ('development' == app.get('env')) {
    app.basePath = "/Users/arein/node/letterapp";
} else {
    app.basePath = "/var/www/letterapp";
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

var poet = Poet(app, {
    posts: './private/blog/',
    postsPerPage: 2,
    metaFormat: 'json',
    showDrafts: true,
    showFuture: true,
    routes: {
        '/blog/:post': 'post',
        '/blog/page/:page': 'page',
        '/blog/tag/:tag': 'tag',
        '/blog/category/:category': 'category'
    }
});

poet.init(function (err, poet) {
}).then(function () {
});

app.get('/', index.index);
app.get('/pricing', index.pricing);
app.get('/faq', index.faq);
app.get('/blog', index.blog);
app.get('/imprint', index.imprint);
app.get('/contact', index.contact);
app.get('/how-sending-a-letter-online-works', index.howitworks);
app.get('/letters/calculate-price', letter.calculatePrice);
app.get('/admin', auth, admin.index);
app.post('/letters/:id', letter.purchaseLetter);
app.post('/letters', letter.uploadLetter);
app.get('/downloads/osx', index.osxDownload);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Mils server listening on port ' + app.get('port'));
});

export = app;