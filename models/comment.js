/*
title
body
rating
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    isFlagged: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('Comment', CommentSchema);