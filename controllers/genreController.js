// Include Required Model
const Genre = require('../models/genre'),
    Book    = require('../models/book'),
    async   = require('async'); // Include Async Module
// Include Express Validator to Validate Data
const {body, sanitizeBody, validationResult} = require('express-validator');

/**
 * Display The Form of Genre Create
 */
exports.genreCreateForm = (req, res, next) => {
    res.render('./genre/create', { title: 'Create Genre' });
};

/**
 * Middleware to Validate Data 
 */
exports.validate = (method) => {
    switch (method) {
        case 'genreCreate': {
            return [
                // Validate Data
                body('name', 'Genre Name is Required')
                    .isLength({ min:3, max:30 })
                    .trim()
                    .exists(),

                // Sanitize Data
                sanitizeBody('name').escape(),
            ];
        }
    }
};

/**
 * Handle Genre Create Request
 */
exports.genreCreate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        const genre  = await new Genre({
            name : req.body.name
        });

        if(!errors.isEmpty()) {
            res.render('./genre/create', {
                title : 'Create Genre',
                genre : genre,
                errors: errors.array()
            });
        } else {
            Genre.findOne({ 'name': req.body.name }).exec((error, genreExists) => {
                if(error) return next(error);

                if(genreExists) {
                    res.redirect(genreExists.url);
                } else {
                    genre.save((error) => {
                        if (error) return next(error);
                        // Saved Genre and Redirect to Genre Detail Page.
                        res.redirect('./');
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Genre Update Form
 */
exports.genreEdit = (req, res, next) => {
    res.send('Genre Update Form');
};

/**
 * Handle Genre Update Request
 */
exports.genreUpdate = (req, res, next) => {
    res.send('Genre Update');
};

/**
 * Display The Genre Delete Form
 */
exports.genreDeleteForm = (req, res, next) => {
    res.send('Genre Delete Form');
};

/**
 * Handle Genre Delete Request
 */
exports.genreDelete = (req, res, next) => {
    res.send('Genre Delete');
};

/**
 * Display The List of All Genre
 */
exports.genreList = async(req, res, next) => {
    try {
        await Genre.find({}).exec((error, genreList) => {
            if (error) return genreList;

            // console.log(genreList);
        
            res.render('./genre/index', { title: 'Genre List', genreList: genreList});
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Details of a Genre
 */
exports.genreDetail = (req, res, next) => {
    try {
        async.parallel({
            genre: (callback) => {
                Genre.findById(req.params.id).exec(callback);
            },
            books: (callback) => {
                Book.find({'genre': req.params.id}).exec(callback);
            }
        }, (error, values) => {
            if(error) return next(error);

            if(values.genre == null) {
                const error = new Error('Genre not Found');
                error.status = 404;

                return next(error);
            }

            res.render('./genre/detail', {
                title: 'Book Genre Details',
                error: error,
                genre: values.genre,
                genreBooks: values.books
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};