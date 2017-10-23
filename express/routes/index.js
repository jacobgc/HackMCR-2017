var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('rethinkdbdash')();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {login : login || null});
});

router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/profile', function(req, res, next) {
    res.render('profile', {login : login || null});
});

router.get('/signup', function(req, res, next) {
    res.render('signup',{login : login || null});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

router.get('/login', function(req, res, next) {
    res.render('login', {login : login || null});
});

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/events', function(req, res, next) {
    res.render('events', {login : login || null});
});

router.get('/eventloc', function(req, res, next) {
    res.render('eventLocation', { login : login || null});
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