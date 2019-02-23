const express = require('express');
const router = express.Router();
const BookService = require('../services/bookService');

router.get('/getCategories', (req, res) => {
    BookService.GetBookCategoriesCached().then(response => {
        return res.json(response);
    }).catch(err => {
        console.log(err);
        return res.status(500).send(err.message);
    });
});

router.get('/getBooks/:categoryNames', (req, res) => {
    let categoryNames = JSON.parse(req.params.categoryNames);
    BookService.GetBooks(categoryNames).then(books => {
        if (books.length > 0) {
            res.json(books);
        } else {
            res.status(416).end();
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    });
});

router.post('/saveBooks/:id', (req, res) => {
    let ids = JSON.parse(req.params.id);
    Promise.all(ids.map(async id => {
        return await BookService.SaveBook(id);
    })).then(savedBooks => {
        BookService.GetActiveBookCount().then(count => {
            res.json({totalBookCount: count, bookCount: savedBooks.length});
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        });
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    });
});

module.exports = router;