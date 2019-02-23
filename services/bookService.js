const axios = require('axios');
const lodash = require('lodash');
const {Books} = require('../models');
const cacheService = require('./cacheService');

function GetBookCategories() {
    return new Promise((resolve, reject) => {
        if (!process.env.NYT_APIKEY) {
            return reject('You must provide New York Times Api Key to get book list');
        }
        axios.get('https://api.nytimes.com/svc/books/v3/lists/names.json', {
            params: {
                'api-key': process.env.NYT_APIKEY
            }
        }).then(response => {
            if (!response.data)
                return reject("Couldn't retrieve categories.");
            return resolve(response.data);
        }).catch(err => {
            return reject(err);
        });
    });
}

async function GetBookCategoriesCached() {
    const key = 'express__getCategories';
    const cache = await cacheService.GetFromCache(key);
    if (!cache) {
        const data = await GetBookCategories();
        await cacheService.SaveToCache(key, data);
        return data;
    } else {
        return cache;
    }
}

function GetBookList(categoryName) {
    return new Promise((resolve, reject) => {
        if (!categoryName) {
            return reject('You must provide category name to retrieve book list');
        }
        if (!process.env.NYT_APIKEY) {
            return reject('You must provide New York Times Api Key to get book list');
        }
        axios.get('https://api.nytimes.com/svc/books/v3/lists.json', {
            params: {
                'api-key': process.env.NYT_APIKEY,
                'list': categoryName
            }
        }).then(response => {
            if (!response.data)
                return reject("Couldn't retrieve book list from " + categoryName);
            return resolve(response.data);
        }).catch(err => {
            return reject(err);
        });
    });
}

async function GetBookListCached(categoryName) {
    const key = 'getBookList_' + categoryName;
    const cache = await cacheService.GetFromCache(key);
    if (!cache) {
        const data = await GetBookList(categoryName);
        await cacheService.SaveToCache(key, data);
        return data;
    } else {
        return cache;
    }
}

function GetBookDetails(isbn) {
    return new Promise(async (resolve, reject) => {
        if (!isbn || isbn === 'undefined') {
            return reject('You must provide a isbn number to get book details');
        }
        if (!process.env.GOOGLE_APIKEY) {
            return reject('You must provide Google Api Key to get book details');
        }
        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: 'isbn:' + isbn,
                    key: process.env.GOOGLE_APIKEY
                }
            });
            if (!response.data) return reject("Couldn't retrieve book details of isbn " + isbn);
            if (!response.data.items || response.data.items.length === 0) return resolve(null);
            return resolve(response.data.items[0]);
        } catch (e) {
            return reject(e);
        }
    });
}

async function GetBookDetailsCached(isbn) {
    let isbn13 = isbn.replace(/[^0-9]/g, '');
    const key = 'BookDetails_' + isbn13;
    const cache = await cacheService.GetFromCache(key);
    if (!cache) {
        const data = await GetBookDetails(isbn13);
        await cacheService.SaveToCache(key, data, 0);
        return data;
    } else {
        return cache;
    }
}

function BookExists(isbn13) {
    return new Promise((resolve, reject) => {
        Books.findOne({isbn13: isbn13}).then(book => {
            if (book) {
                resolve({isbn: isbn13, exists: true});
            } else {
                resolve({isbn: isbn13, exists: false});
            }
        }).catch(err => reject(err));
    });
}

async function GetBooks(categories) {
    const nytBooks = await Promise.all(categories.map(async category => {
        return await GetBookListCached(category);
    }));
    if (!nytBooks) return null;
    const books = lodash.flattenDeep(nytBooks.map(list => {
        return list.results.map(book => {
            let newBook = new Books();
            //newBook.title = book.book_details[0].title;
            newBook.isbn10 = book.book_details[0].primary_isbn10;
            newBook.isbn13 = book.book_details[0].primary_isbn13;
            newBook.amazonLink = book.amazon_product_url;
            return newBook;
        });
    }));
    if (books.length === 0) return null;
    const newBooks = books.filter(async book => {
        const isExists = await BookExists(book.isbn13);
        if (!isExists.exists) return true;
    });
    const result = await Promise.all(newBooks.map(async book => {
        let detail = await GetBookDetailsCached(book.isbn13);
        if (detail) {
            book.title = detail.volumeInfo.title;
            book.googleLink = detail.selfLink;
            book.description = detail.volumeInfo.description;
            book.publishDate = detail.volumeInfo.publishedDate;
            book.publisher = detail.volumeInfo.publisher;
            if (detail.volumeInfo.authors) {
                book.author = detail.volumeInfo.authors.join(', ');
            }
            book.pageCount = detail.volumeInfo.pageCount;
            book.imageLink = detail.volumeInfo.imageLinks.thumbnail.toString().replace('&zoom=1', '');
            if (detail.volumeInfo.categories) {
                book.categories = detail.volumeInfo.categories.join(', ');
            }
            return book;
        }
    }));
    const cleanResult = result.filter(book => {
        if (book !== undefined)
            return true;
    });
    return await Books.insertMany(cleanResult);
}

function SaveBook(id) {
    return new Promise((resolve, reject) => {
        Books.findById(id).then(book => {
            if (book) {
                book.isActive = true;
                book.save().then(savedBook => {
                    resolve(savedBook);
                }).catch(err => reject(err));
            } else {
                resolve(null);
            }
        }).catch(err => reject(err));
    });
}

function GetActiveBookCount() {
    return new Promise((resolve, reject) => {
        Books.countDocuments({isActive: true}).then(count => {
            resolve(count);
        }).catch(err => reject(err));
    });
}

module.exports = {
    GetBookCategories,
    GetBookCategoriesCached,
    GetBookList,
    GetBookListCached,
    GetBookDetails,
    GetBookDetailsCached,
    SaveBook,
    GetActiveBookCount,
    GetBooks
};