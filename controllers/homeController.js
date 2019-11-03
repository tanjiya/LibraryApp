// Include Required Model
const Book       = require('../models/book'),
    Author       = require('../models/author'),
    Genre        = require('../models/genre'),
    BookInstance = require('../models/bookInstance');

/**
 * Home Page of The Web Application
 */
exports.home = async(req, res, next) => {
    try {
        // Fetch All of The Data
        const bookCount = await Book.countDocuments(),
            bookInstanceCount = await BookInstance.countDocuments(),bookInstanceAvailableCount = await BookInstance.countDocuments({ status: 'Available' }),
            authorCount = await Author.countDocuments(),
            genreCount = await Genre.countDocuments();

        // Send The Data to Index Page
        res.render('index', {
            title: 'Library',
            bookCount: bookCount,
            bookInstanceCount: bookInstanceCount,
            bookInstanceAvailableCount: bookInstanceAvailableCount,
            authorCount: authorCount,
            genreCount: genreCount
        });

    } catch (error) {
        next(error);
    }
};
