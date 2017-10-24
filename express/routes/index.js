var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('rethinkdbdash')();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index',{user : req.user || false});    
});

router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

// router.use('/', notLoggedIn, function(req, res, next) {
//     next();
// });

router.get('/profile', function(req, res, next) {
    res.render('profile');
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
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/events', function(req, res, next) {
    // https://api.meetup.com/find/events
    // Get LAT/LON from get request
    // Pick random 10 to show (Or a list, we have time)
    // 75782a5064482072a5b1d4f4341181f
    //wget https://api.meetup.com/find/events\?lat\=53.4929725\&lon\=-2.0759403\&key\=75782a5064482072a5b1d4f4341181f
    var lat = req.query.lat;
    var lon = req.query.lon;
    console.log('Hello?');
    console.log(lat,lon);
    res.render('events');
});

router.get('/eventloc', function(req, res, next) {
    res.render('eventLocation');
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