const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const findOrCreate = require('mongoose-find-or-create');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    isbn10: {
        type: String,
        required: true
    },
    isbn13: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    subtitle: {
        type: String,
    },
    categories: {

    },
    description: {
      type: String
    },
    pageCount: {
      type: Number,
      default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    imageLink: {
        type: String
    },
    author: {
        type: String
    },
    publisher: {
        type: String
    },
    publishDate: {
        type: Date,
    },
    googleLink: {
        type: String
    },
    amazonLink: {
        type: String
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    },
    comments: [{type:Schema.Types.ObjectId, ref: 'Comment'}]
});

BookSchema.path('price').get(function(num) {
    return (num / 100).toFixed(2);
});
BookSchema.path('price').set(function(num) {
    return num * 100;
});

BookSchema.plugin(timestamps);
BookSchema.plugin(findOrCreate);

module.exports = mongoose.model('Book', BookSchema);