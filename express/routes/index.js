var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('rethinkdbdash')();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {login : login || false});
});

router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/profile', function(req, res, next) {
    res.render('profile', {login : login || false});
});

router.get('/signup', function(req, res, next) {
    res.render('signup',{login : login || false});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

router.get('/login', function(req, res, next) {
    res.render('login', {login : login || false});
});

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/events', function(req, res, next) {
    res.render('events', {login : login || false});
});

router.get('/eventloc', function(req, res, next) {
    res.render('eventLocation', { login : login || false});
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