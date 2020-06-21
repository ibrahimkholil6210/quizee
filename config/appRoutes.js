const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const DBConfig = require('./db_config');
const DB = DBConfig();

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login')
}

function checkIfAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/admin/dashboard');
    }

    next();
}

router.get("/admin/dashboard", checkAuth, (req, res) => {
    let query = DB.query("SELECT * FROM quiz", (err, results) => {
        if (err) throw new Error("problem while fetching quiz!");
        res.render('dashboard/index', { results, user: req.user.name });
    });
});

router.get("/admin/dashboard/addquize", checkAuth, (req, res) => {
    res.render('dashboard/addquize');
});

router.post("/admin/dashboard/addquize", checkAuth, (req, res) => {
    let query = DB.query(`INSERT INTO quiz (question,options,answer) VALUES ('${req.body.question}','${req.body.answer}','${req.body.answerRadio}')`, (err, result) => {
        if (err) res.render('dashboard/addquize');
        req.flash("success", "Quiz added!");
        res.render('dashboard/addquize')
    });
});

router.get('/admin/login', checkIfAuth, (req, res) => {
    res.render('login');
});

router.post('/admin/login', checkIfAuth, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    successFlash: true,
    failureRedirect: '/admin/login',
    failureFlash: true,
}));


router.get('/admin/register', checkIfAuth, (req, res) => {
    res.render('register');
});


router.post('/admin/register', checkIfAuth, async (req, res) => {
    if (req.body.name === '' || req.body.email === '' || req.body.password === '') {
        req.flash("warning", "Missing Credentials!");
        res.redirect("/admin/register");
        return;
    }
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        let query = DB.query(`INSERT INTO user (name,email,password) VALUES ('${req.body.name}','${req.body.email}','${hashedPass}')`, (err, result) => {
            if (err) res.redirect('/register');
            res.redirect('/admin/login')
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/register');
    }
});

router.get('/admin/logout', (req, res) => {
    req.logOut();
    res.redirect('/admin/login');
});

router.get('/api/quizs', (req, res) => {
    DB.query("SELECT * FROM quiz", (err, results) => {
        if (err) throw new Error("problem while inserting customer!");
        res.json(results);
    });
});


router.get('/', (req, res) => {
    res.status(200).render('index');
});

module.exports = router;