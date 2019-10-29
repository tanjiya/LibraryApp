// Include Required Model
const Book = require('../models/book'),
    Author = require('../models/author'),
    Genre   = require('../models/genre'),
    BookInstance = require('../models/bookInstance'), // Include Book Schema
    async   = require('async'); // Include Async Module

/**
 * Home Page of The Web Application
 */
exports.home = (req, res, next) => {
    try {
        async.parallel({
            bookCount: (callback) => {
                Book.countDocuments(callback);
            },
            bookInstanceCount: (callback) => {
                BookInstance.countDocuments(callback);
            },
            bookInstanceAvailableCount: (callback) => {
                BookInstance.countDocuments({status: 'Available'}, callback);
            },
            authorCount: (callback) => {
                Author.countDocuments(callback);
            },
            genreCount: (callback) => {
                Genre.countDocuments(callback);
            }
        }, (err, values) => {
            res.render('index', { title: 'Library', error: err, data: values });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
