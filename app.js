var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbUrl = "mongodb://pawko:asd123@ds245687.mlab.com:45687/tzt02";

var index = require('./routes/index');
var users = require('./routes/users');
var Users = require('./mongoDB/user');
var products = require("./routes/products");
var userList = require("./routes/userList");
var app = express();
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));

var session = require('express-session');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

mongoose.connect(dbUrl, function (err) {
    if (err) {
        console.log('błąd połączenia', err);
    } else {
        console.log('połączenie udane');
    }
});

var hour = 3600000;

app.use(session({
    secret: "secret", cookie: {maxAge: hour, expires: new Date(Date.now() + hour)},
    resave: false, saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.', link: "login"});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.', link: "login"});
            }
            if (!user.active) {
                // console.log("Not Active");
                return done(null, false, {message: 'User inactive!', link: "login"});
            }
            return done(null, user);
        });
    }
));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/products', products);
app.use('/userList', userList);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", res);
});

module.exports = app;
