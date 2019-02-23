const LocalStrategy = require('passport-local').Strategy;
const {Users} = require('../models');

module.exports = function (passport) {
    // use static authenticate method of model in LocalStrategy
    passport.use(new LocalStrategy(Users.authenticate()));

// use static serialize and deserialize of model for passport session support
    passport.serializeUser(Users.serializeUser());
    passport.deserializeUser(Users.deserializeUser());
};