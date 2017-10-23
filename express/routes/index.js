var express = require('express');
var router = express.Router();
var r = require('rethinkdbdash')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;
router.get('/events', function(req, res, next) {
    res.render('events', { title: 'Express' });
});

module.exports = router;
