const express = require('express');
const passport = require('passport');
const {Users} = require('../models');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/users/');
    } else {
        res.render('index', {title: 'Book Advisor', user: null});
    }
});
/*
router.get('/signup', (req, res) => {
    res.render('signup', {});
});
*/
/*
router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});
*/
router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.post('/signup', (req, res, next) => {
    const {susername, semail, spassword} = req.body;
    Users.register(new Users({username: susername, email: semail}), spassword, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('index', {error: err.message});
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
