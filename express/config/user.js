var bcrypt = require('bcrypt-nodejs');
var r = require('rethinkdb');

var connection = null;
r.connect({ host: 'localhost', port: '28015' }, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

class user {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    encryptPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    save() {
        r.db('signup').table('users').insert({
            username: this.username,
            password: this.password,
            email: this.email
        }).run(connection, function(err, result) {
            if (err) return err;
            console.log(result)
        });
    }
}

module.exports = user;