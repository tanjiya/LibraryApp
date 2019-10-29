const mongoose = require('mongoose'), // Import The Mongoose Module
    Schema     = mongoose.Schema; // Declare Mongoose Schema

// Define Book Schema
const BookSchema = new Schema({
    title: {
        type     : String,
        required : [true, 'Book Title is Required'],
        max      : 100,
        min      : 5,
        trim     : true,
        lowercase: true
    },
    author: {
        type    : Schema.Types.ObjectId,
        ref     : 'Author',
        required: [true, 'Author is Required']
    },
    summary: {
        type     : String,
        required : [true, 'Summary is Required'],
        max      : 500,
        min      : 100,
        trim     : true,
        lowercase: true
    },
    isbn: {
        type    : String,
        required: [true, 'ISBN is Required'],
        trim    : true
    },
    genre: [{
        type: Schema.Types.ObjectId,
        ref : 'Genre'
    }]
}, { collection : 'book', timestamps: true });

// Virtual for Book's URL
BookSchema
    .virtual('url')
    .get(function() {
        return this._id;
    });

module.exports = mongoose.model('Book', BookSchema);
