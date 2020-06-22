const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./config/passport_config');
const app = express();
const DBConfig = require('./config/db_config');
const DB = DBConfig();
const routes = require('./config/appRoutes');


app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


initializePassport(
    passport
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);


app.listen('3000', () => {
    console.log("Server is runnig at 3000");
});






