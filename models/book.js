//Import The Mongoose Module
const mongoose = require('mongoose');
// Declare Mongoose Schema
const Schema   = mongoose.Schema;

// Define Book Schema
const BookSchema = new Schema({
    title: {
        type    : String,
        required: [true, 'Book Title is Required'],
        max     : 100,
        min     : 5
    },
    author: {
        type    : Schema.Types.ObjectId,
        ref     : 'Author',
        required: [true, 'Author is Required']
    },
    summary: {
        type    : String,
        required: [true, 'Summary is Required'],
        max     : 500,
        min     : 100
    },
    isbn: {
        type    : String,
        required: [true, 'ISBN is Required']
    },
    genre: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Genre'
        }
    ]
}, { collection: 'book' }, { timestamps: true });

// Virtual for Book's URL
BookSchema
.virtual('url')
.get(() => {
    return '/catelog/book/' + this._id;
});

module.exports = mongoose.model('Book', BookSchema);
