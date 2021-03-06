/// <reference path='./../vendor/typescript-node-definitions/node.d.ts'/>
/// <reference path='./../vendor/typescript-node-definitions/mongodb.d.ts'/>
/// <reference path='./../vendor/typescript-node-definitions/express3.d.ts'/>
/**
* Module dependencies.
*/
var config = require("./config");
var FaqHelper = require("./util/FaqHelper");
var express = require('express'), routes = require('./routes/index'), letter = require('./routes/letter'), index = require('./routes/index'), admin = require('./routes/admin'), http = require('http'), path = require('path'), mailer = require('express-mailer'), Poet = require('poet');

var app = module.exports = express();

// development only
if ('development' == app.get('env')) {
    app.basePath = "/Users/arein/node/letterapp";
} else {
    app.basePath = "/var/www/letterapp";
}

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

// all environments
app.use(express.limit('70mb'));
app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ limit: '70mb' }));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { pretty: config.isProd() });
app.locals.pretty = !config.isProd();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
if (!config.isProd()) {
    app.use(allowCrossDomain);
}
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//if ('development' == app.get('env')) {
if (false) {
    mailer.extend(app, config.getDevMailCredentials());
} else {
    mailer.extend(app, config.getProdMailCredentials());
}

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
});

// Synchronous Function
var auth = express.basicAuth(function (user, pass) {
    var admins = config.getAdmins();
    for (var i = 0; i < admins.length; i++) {
        if (admins[i].login == user && admins[i].password == pass)
            return true;
    }

    return false;
});

var poet = Poet(app, {
    posts: config.getBasePath() + '/private/blog/',
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
app.get('/about-mils', index.aboutMils);
app.get('/pricing', index.pricing);
app.get('/faq', index.faq);
app.get('/faq/:title', index.faqSub);
app.get('/blog', index.blog);
app.get('/imprint', index.imprint);
app.get('/contact', index.contact);
app.get('/letters/calculate-price', letter.calculatePrice);
app.get('/admin', auth, admin.index);
app.post('/letters/:id', letter.purchaseLetter);
app.get('/letters/pn/:id', letter.pushNotification);
app.post('/letters', letter.uploadLetter);
app.get('/downloads/osx', index.osxDownload);
app.post('/geocode', letter.geocode);

app.get('/blog/rss', function (req, res) {
    var posts = poet.helpers.getPosts(0, poet.helpers.getPostCount());
    res.setHeader('Content-Type', 'application/rss+xml');
    res.render('rss', { posts: posts });
});

// Rendering
app.locals.faqs = FaqHelper.getFaqRecords();

app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Mils listening on port ' + app.get('port'));
});

module.exports = app;
//# sourceMappingURL=app.js.map
