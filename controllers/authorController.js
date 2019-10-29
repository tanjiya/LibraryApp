const Author = require('../models/author'), // Include Author Model
    Book     = require('../models/book'), // Include Book Model
    async    = require('async'); // Include Async Module
// Include Express Validator to Validate Data
const {body, sanitizeBody, validationResult} = require('express-validator');

/**
 * Display The Form of Author Create 
 */
exports.authorCreateForm = (req, res, next) => {
    res.render('./author/create', { title: 'Create Author' });
};

/**
 * Middleware to Validate Data
 */
exports.validate = (method) => {
    switch(method) {
        case 'authorCreate': {
            return [
                // Validate Data
                body('firstName', 'First Name is Required')
                    .isLength({ min:3, max:20 })
                    .trim()
                    .isAlphanumeric().withMessage('First Name Has Non-Alphanumeric Characters')
                    .exists(),
                body('lastName', 'Last Name is Required')
                    .isLength({ min:3, max:20 })
                    .trim()
                    .isAlphanumeric().withMessage('Last Name Has Non-Alphanumeric Characters.')
                    .exists(),
                body('dateOfBirth', 'Invalid Date of Birth')
                    .optional({ checkFalsy: true }).isISO8601(),
                body('dateOfDeath', 'Invalid Date of Death')
                    .optional({ checkFalsy: true }).isISO8601(),
                
                // Sanitize Data
                sanitizeBody('firstName').escape(),
                sanitizeBody('lastName').escape(),
                sanitizeBody('dateOfBirth').toDate(),
                sanitizeBody('dateOfDeath').toDate(),
            ];
        }
    }
};

/**
 * Handle Author Create Request
 */
exports.authorCreate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        var author = await new Author({
            firstName   : req.body.firstName,
            lastName    : req.body.lastName,
            dateOfBirth : req.body.dateOfBirth,
            dateOfDeath : req.body.dateOfDeath,
        });

        if(!errors.isEmpty()) {
            res.render('./author/create', {
                title : 'Create Author',
                author: author,
                errors: errors.array()
            });
        } else {
            Author.findOne({ 'firstName': req.body.firstName, 'lastName': req.body.lastName}).exec((error, authorExists) => {
                if(error) return next(error);

                if (authorExists) {
                    res.redirect(authorExists.url);
                } else {
                    author.save((error) => {
                        if (error) return next(error);
                        // Saved Author and Redirect to Author Detail Page.
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
 * Display The Author Update Form
 */
exports.authorEdit = (req, res, next) => {
    res.send('Author Update Form');
};

/**
 * Handle Author Update Request
 */
exports.authorUpdate = (req, res, next) => {
    res.send('Author Update');
};

/**
 * Display The Author Delete Form
 */
exports.authorDeleteForm = (req, res, next) => {
    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authorBooks: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('./author/delete', {
            title: 'Delete Author',
            author: results.author,
            author_books: results.authorBooks
        });
    });
};

/**
 * Handle Author Delete Request
 */
exports.authorDelete = (req, res, next) => {
    try {
        async.parallel({
            author: (callback) => {
                Author.findById(req.body.authorId).exec(callback);
            },
            books: (callback) => {
                Book.find({ 'author': req.body.authorId }).exec(callback);
            }
        }, (error, values) => {
            if(error) return next(error);

            if(values.books.length > 0) {
                res.render('./author/delete', {
                    title: 'Delete Author',
                    author: values.author,
                    authorBooks: values.books
                });
            } else {
                const deleteAuthor = (error) => {
                    if(error) return next(error);

                    res.redirect('/author');
                };
                Author.findByIdAndRemove(req.body.authorId, deleteAuthor);
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The List of All Author
 */
exports.authorList = async(req, res, next) => {
    try {
        await Author.find({}).exec((error, authorList) => {
            if(error) return authorList;

            // console.log(authorList);

            res.render('./author/index', { title: 'Author List', authorList: authorList});
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Details of a Author
 */
exports.authorDetail = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        books: (callback) => {
            Book.find({ 'author': req.params.id }).exec(callback);
        }
    }, (error, values) => {
        if(error) return next(error);

        if(values.author == null) {
            const error = new Error('Author not Found');
            error.status = 404;

            return next(error);
        }

        res.render('./author/detail', {title: 'Author Detail', author: values.author, authorBooks: values.books});
    });
};
