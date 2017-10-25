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
    var lat = req.query.lat; // Get required variables from the client
    var lon = req.query.lon;
    var page = req.query.page || 0;
    var startItems = page * 10

    assert(lat, 'Lat NOT defined'); // Throw error if required variables not given
    assert(lon, 'Lon NOT defined');

    request('https://api.meetup.com/find/events?lat=' + lat + '&lon=' + lon + '&key=75782a5064482072a5b1d4f4341181f', function(error, response, body) {
        var results = JSON.parse(body); // Make request to the API and parse the data ready to be given to EJS
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
        res.render('events', { // Render the page with EJS and the given data
            events: resultsToEJS,
            page: page
        });
    });
});

router.get('/eventloc', function(req, res, next) {
    res.render('eventLocation');
});

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

module.exports = router;
