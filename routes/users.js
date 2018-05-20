var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var Users = require('./../mongoDB/user');
var sha1 = require('sha1');
var CustomMailer = require('./../mailer/mailer');
var passport = require('passport');
/* GET . */
router.get('/', function (req, res, next) {
    res.render('error', {title: "User Module", message: "Witaj w module użytkowników", user: req.user});
});

router.get('/login', function (req, res, next) {
    res.render('pages/login', {title: "Login", user: req.user});
});

router.post('/login',
    passport.authenticate('local',
        {
            session: true,
            successRedirect: '../',
            failureRedirect: '/users/niezalogowany'
        })
);
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});
router.get('/niezalogowany', function (req, res, next) {
    var data = {
        title: "Login message",
        message: "Niepoprawne dane logowania lub Twoje konto nie zostało aktywowane",
        link: "login"
    };
    res.render('error', data);
})

/* GET User create form*/
router.get('/register', function (req, res, next) {
    res.render('pages/register', {title: "Register"});
});
/* POST Create User*/
router.post('/register', urlencodedParser, function (req, res, next) {
    if (!req.body.username || !req.body.password || !req.body.confirm_password ||
        req.body.password !== req.body.confirm_password || !req.body.email) {
        res.render('error', {
            title: "Register message",
            message: "Register Unsuccesfull", error: {
                status: "Nie wszystkie pola zostały poprawnie wypełnione"
            },
            link: "register"
        });

    } else {
        var data = req.body;
        data.admin = false;
        data.active = false;
        data.password = sha1(data.password);
        Users.create(data, function (err, doc) {
            if (err) return next(err);

            var link = 'https://morning-tor-49790.herokuapp.com/users/activate/' + doc.id;
            var mailOptions = CustomMailer.mailOptions;
            mailOptions.subject = 'Aktywacja konta';
            mailOptions.html = '<a href="' + link + '">Aktywuj konto!</a>';
            mailOptions.to = doc.email;
            CustomMailer.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.send('Wiadomość ' + info.messageId + ' wysłana: ' + info.response);
            });
            res.render('registered', req);
        });
        res.render('error', {
            title: "Register message",
            message: "Rejestracja udana",
            error: {status: "Link aktywacyjny został wysłany, sprawdź swój adres email"}
        });

    }
});
router.get('/activate/:id', function (req, res, next) {
    Users.findByIdAndUpdate(req.params.id, {active: true}, function (err, doc) {
        if (err) return next(err);
        let text = "Konto " + doc.username + " zostało aktywowane";
        res.render('error', {title: "Aktywacja", message: "Aktywacja udana", error: {status: text}});
    });
});
module.exports = router;
