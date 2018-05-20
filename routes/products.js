var express = require('express');
var router = express.Router();
var Products = require('../mongoDB/product');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

router.get('/', checkAuthentication, function (req, res, next) {
    Products.find({}, function (err, products) {
        req.produkty = products;
        req.title = "Produkty";
        res.render('pages/product-list', req)
    });
});

router.get('/list', checkAuthentication, function (req, res, next) {
    Products.find({}, function (err, products) {
        res.send(products);
    });
});
router.get('/add', checkAuthentication, function (req, res, next) {
    req.title = "Produkct Add";
    res.render('pages/product-add', req)
});

router.post('/add', function (req, res, next) {
    Products.create(req.body, function (err, doc) {
        if (err) return next(err);
        else {
            req.title = "Produkt";
            req.message = "Produkt o nazwie " + doc.name + " został dodany do bazy";
            res.render('error', req)
        }
    });
});

router.get('/detail/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findById(req.params.id, {
        category: true,
        name: true,
        color: true,
        price: true,
        active: true
    }, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
});
router.get('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findById(req.params.id, {
        category: true,
        name: true,
        color: true,
        price: true,
        active: true
    }, function (err, product) {
        if (err) return next(err);
        req.produkt = product;
        res.render('pages/product-update', req);
    })
});
router.post('/update/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findByIdAndUpdate(req.params.id, req.body, function (err, doc) {
        if (err) return next(err);
        req.title = "Product";
        req.message = "Aktualizacja produktu o nazwie: " + doc.name + " została zakończona sukcesem"
        res.render('error', req)
    });
});
router.put('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findByIdAndUpdate(req.params.id, req.body, function (err, doc) {
        if (err) return next(err);
        req.title = "Product";
        req.message = "Aktualizacja produktu o nazwie: " + doc.name + " została zakończona sukcesem"
        res.render('error', req)
    });
});

router.get('/delete/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) return next(err);
        req.message = doc.name + " został usuniety";
        req.title = "Product";
        res.render('error', req)
    });
});
router.delete('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Products.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) return next(err);
        req.message = doc.name + " został usuniety";
        req.title = "Product";
        res.render('error', req)
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
