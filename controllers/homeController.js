var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');

var async = require('async');

// Home Page of The Web Application
exports.home = (req, res, next) => {
    async.parallel({
        bookCount: function(callback) {
            Book.countDocuments(callback);
        },
        bookInstanceCount: function(callback) {
            BookInstance.countDocuments(callback);
        },
        bookInstanceAvailableCount: function(callback) {
            BookInstance.countDocuments({status: 'Available'}, callback);
        },
        authorCount: function(callback) {
            Author.countDocuments(callback);
        },
        genreCount: function(callback) {
            Genre.countDocuments(callback);
        }
    }, function(err, values) {
        res.render('index', { title: 'Library', error: err, data: values });
    });
};
