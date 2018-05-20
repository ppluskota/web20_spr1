var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var User = require('../mongoDB/user');

router.get('/', checkAuthentication, function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        req.title = "Uzytkownicy";
        req.users = users;
        res.render('pages/user-list', req);
    });

});
router.get('/list', checkAuthentication, function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.send(users);
    });

});

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("../users/login");
    }
}
module.exports = router;
