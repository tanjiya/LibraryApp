const Author = require('../models/author'), // Include Author Model
    Book     = require('../models/book'), // Include Book Model
    async    = require('async'); // Include Async Module
// Include Express Validator to Validate Data
const { body, sanitizeBody, validationResult } = require('express-validator');

/**
 * Display The Form of Author Create 
 */
exports.authorCreateForm = (req, res, next) => {
    res.render('./author/form', { title: 'Create Author' });
};

/**
 * Middleware to Validate Data
 */
exports.validate = (method) => {
    switch(method) {
        case 'authorCreate':
        case 'authorUpdate': {
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

        var author = new Author({
            firstName   : req.body.firstName,
            lastName    : req.body.lastName,
            dateOfBirth : req.body.dateOfBirth,
            dateOfDeath : req.body.dateOfDeath,
        });

        if(!errors.isEmpty()) {
            res.render('./author/form', {
                title : 'Create Author',
                author: author,
                errors: errors.array()
            });
        } else {
            await Author.findOne({ 'firstName': req.body.firstName, 'lastName': req.body.lastName}).exec((error, authorExists) => {
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
        next(error);
    }
};

/**
 * Display The Author Update Form
 */
exports.authorEdit = async(req, res, next) => {
    try {
        await Author.findById(req.params.id, (error, author) => {
            if(error) return next(error);
    
            if(author == null) {
                let error = new Error('Author not Found');
                error.status = 404;
                return next(error);
            }
    
            res.render('./author/form', {
                title: "Update Author",
                author: author,
            });
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle Author Update Request
 */
exports.authorUpdate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            dateOfdeath: req.body.dateOfdeath,
            _id: req.params.id,
        });

        if(!errors.isEmpty()) {
            res.render('./author/form', {
                title: 'Update Author',
                author: author,
                errors: errors.array()
            });
        } else {
            await Author.findByIdAndUpdate(req.params.id, author, {}, (error, author) => {
                if(error) return next(error);

                res.redirect('./');
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Display The Author Delete Form
 */
exports.authorDeleteForm = async(req, res, next) => {
    try {
        const author = await Author.findById(req.params.id).exec(),
            authorBooks = await Book.find({ 'author': req.params.id }).exec();
        
        if (author == null) {
            res.redirect('./author');
        } else {
            // Successful, so render delete form.
            res.render('./author/delete', {
                title: 'Delete Author',
                author: author,
                authorBooks: authorBooks
            });
        }
    } catch (error) {
        next (error);
    }
};

/**
 * Handle Author Delete Request
 */
exports.authorDelete = async(req, res, next) => {
    try {
        const author = await Author.findById(req.params.id).exec(),
            books = await Book.find({ 'author': req.params.id }).exec();

        if(authorBooks.length > 0) {
            res.render('./author/delete', {
                title: 'Delete Author',
                author: author,
                authorBooks: books
            });
        } else {
            const deleteAuthor = (error) => {
                if(error) return next(error);

                res.redirect('/author');
            };

            await Author.findByIdAndRemove(req.body.authorId, deleteAuthor);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Display The List of All Author
 */
exports.authorList = async(req, res, next) => {
    try {
        await Author.find({}).exec((error, list) => {
            if(error) return list;

            // console.log(list);

            res.render('./author/index', {
                title: 'Author List',
                authorList: list
            });
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Display The Details of a Author
 */
exports.authorDetail = async(req, res, next) => {
    try {
        const author = await Author.findById(req.params.id).exec(),
            books = await Book.find({ 'author': req.params.id }).exec();
    
            if(author == null) {
                const error = new Error('Author not Found');
                error.status = 404;
    
                return next(error);
            }
    
            res.render('./author/detail', {
                title: 'Author Detail',
                author: author,
                authorBooks: books
            });
    } catch (error) {
        next(error);
    }
};
