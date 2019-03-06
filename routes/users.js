const express = require('express');
const router = express.Router();
const {Books} = require('../models');

/* GET users listing. */
router.get('/', function (req, res, next) {
    /*if (req.user.isAdmin) {
        res.render('admindashboard', {user: req.user});
    } else {
        res.render('userdashboard', {user: req.user});
    }*/
    Books.find({isActive: true}).then(books=> {
        res.render('userdashboard', {user: req.user, books: books});
    }).catch(err => console.log(err));
});

router.get('/addbooks', (req, res) => {
    res.render('addbooks', {title: 'Add Books'});
});

router.get('/book/:isbn', (req,res) => {
    Books.findOne({isbn13: req.params.isbn}).then(book => {
        if (book) {
            return res.render('book', {book: book});
        }
        return res.redirect('/');
    }).catch(err => console.log(err));
});
module.exports = router;
