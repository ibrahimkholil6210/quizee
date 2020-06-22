const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const DBConfig = require('./db_config');
const DB = DBConfig();


function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        DB.query(`SELECT * FROM user WHERE email = '${email}'`, (err, results) => {
            if (err) return done(err);
            if (!results.length) {
                return done(null, false, { message: 'Please check your credential! User Not found' }); // req.flash is the way to set flashdata using connect-flash
            }

            if (!bcrypt.compareSync(password, results[0].password)) {
                return done(null, false, { message: 'Please check your credential! password missmatch' });
            }

            return done(null, results[0]);
        });
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => {
        DB.query(`SELECT * FROM user WHERE id = '${id}'`, (err, results) => {
            if (err) throw new Error("problem while inserting customer!");
            done(err, results[0]);
        });
    });
}

module.exports = initialize;