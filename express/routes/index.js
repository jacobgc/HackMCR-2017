var express = require('express');
var router = express.Router();
var passport = require('passport');
var r = require('rethinkdbdash')();
var request = require('request');
var assert = require('assert');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index', { user: req.user || false });
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
    res.render('signup', { user: req.user || false });
});
213312
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

router.get('/contact', function(req, res, next) {
    res.render('contact');
});
router.get('/events', function(req, res, next) {
    // https://api.meetup.com/find/events
    // Get LAT/LON from get request
    // Pick random 10 to show (Or a list, we have time)
    // 75782a5064482072a5b1d4f4341181f
    //wget https://api.meetup.com/find/events\?lat\=53.4929725\&lon\=-2.0759403\&key\=75782a5064482072a5b1d4f4341181f
    var lat = req.query.lat;
    var lon = req.query.lon;
    var page = req.query.page || 0;
    var startItems = page * 10
        // Ensure LAT/LON provided
    assert(lat, 'Lat NOT defined');
    assert(lon, 'Lon NOT defined');

    request('https://api.meetup.com/find/events?lat=' + lat + '&lon=' + lon + '&key=75782a5064482072a5b1d4f4341181f', function(error, response, body) {
        var results = JSON.parse(body);
        var resultsToEJS = [];
        for (var index = startItems; index < startItems + 11; index++) {
            try {
                results[index].description = results[index].description.replace(/<[^>]*>/g, '');
                var length = 200;
                results[index].description = results[index].description.substring(0, length);
                resultsToEJS.push(results[index]);
            } catch (err) {
                console.log('Cant get description, oh well');
            }
        }
        console.log(resultsToEJS);
        res.render('events', {
            events: resultsToEJS,
            page: page
        });
    });
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
router.get('/advice', function(req, res, next) {
    res.render('advice');
});

router.get('/lostSomeone', function(req, res, next) {
    res.render('lostSomeone');
});

router.get('/howToTalk', function(req, res, next) {
    res.render('howToTalk');
});