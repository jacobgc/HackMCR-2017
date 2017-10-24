var passport = require('passport');
var r = require('rethinkdbdash')();
var user = require('./user');
var LocalStrategy = require('passport-local').Strategy;


var connection = null;
r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(username, done) {
    r.db('signup').table('users').filter(r.row('username').eq(username)).run()
        .then((result) => {
            if (typeof result[0] !== "undefined") {
                return done(null, result[0]);
            }
        });
});

passport.use('local.signup', new LocalStrategy({
    emailField: 'email',
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {

    r.db('signup').table('users').filter(r.row('email').eq(email)).run()
        .then((result) => {
            if (typeof result[0] !== "undefined") {
                console.log("Error: Email In use");
                return done(null, false, { message: 'email is already in use' });
            } else {
                var newUser = new user();
                newUser.username = req.body.username;
                newUser.password = newUser.encryptPassword(password);
                newUser.email = req.body.email;
                newUser.save();
                console.log('Attempting to save user');
                return done(null, newUser);
            }
        });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {

    r.db('signup').table('users').filter(r.row('email').eq(email)).run()
        .then((result) => {
            if (typeof result[0] == "undefined") {
                return done(null, false, { message: 'no user with that emaail found' });
            } else {
                result = result[0];
                var User = new user(result.username, result.password, result.email);

                if (!User.validPassword(password)) {
                    return done(null, false, { message: "no user found" })
                }
                return done(null, User);
            }
        });

}));