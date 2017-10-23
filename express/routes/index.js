var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('rethinkdbdash')();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    // failureRedirect: '/signup'
}));

    router.get('/events', function(req, res, next) {
    res.render('events', { title: 'Express' });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}