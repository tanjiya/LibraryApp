// Include Required Model
const BookInstance = require('../models/bookInstance'),
    Book           = require('../models/book'),
    async          = require('async');
// Include Express Validator to Validate Data
const {body, sanitizeBody, validationResult} = require('express-validator');

/**
 * Display The List of All BookInstance
 */
exports.bookInstanceList = async(req, res, next) => {
    try {
        await BookInstance.find({}).populate('book').exec((error, bookInstanceList) => {
            if (error) return bookInstanceList;

            // console.log(bookInstanceList);
        
            res.render('./bookinstance/index', {
                title: 'Book Instance List',
                bookInstanceList: bookInstanceList
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Details of a BookInstance
 */
exports.bookInstanceDetail = async(req, res, next) => {
    try {
        await BookInstance.findById(req.params.id).populate('book').exec((error, bookInstance) => {
            if (error) return next(error);
            if (bookInstance == null) { // No results.
                const error = new Error('Book Copy Not Found');
                err.status = 404;
    
                return next(error);
              }
            // Successful, so render.
            res.render('./bookinstance/detail', { title: 'Copy: ' + bookInstance.book.title, bookInstance: bookInstance});
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Form of BookInstance Create 
 */
exports.bookInstanceCreateForm = async(req, res, next) => {
    try {
        await Book.find({}).exec((error, books) => {
            if(error) return next(error);
    
            res.render('./bookinstance/create', {
                title   : 'Create Book Instance',
                bookList: books
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Middleware to Validate Data
 */
exports.validate = (method) => {
    switch (method) {
        case 'bookInstanceCreate': {
            return [
                // Validate Data
                body('book', 'Book Name is Required')
                    .isLength({ min:3, max:30 })
                    .trim(),
                body('imprint', 'Imprint is Required')
                    .isLength({ min:3, max:30 })
                    .trim(),
                body('dueBack', 'Available Date is Required')
                    .optional({ checkFalsy: true })
                    .isISO8601(),

                // Sanitize Data (using wildcard: sanitizeBody('*').escape())
                sanitizeBody('book').escape(),
                sanitizeBody('imprint').escape(),
                sanitizeBody('dueBack').toDate(),
                sanitizeBody('status').trim().escape(),
            ];
        }
    }
};

/**
 * Handle BookInstance Create Request
 */
exports.bookInstanceCreate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        const bookInstance = await new BookInstance({
            book   : req.body.book,
            imprint: req.body.imprint,
            dueBack: req.body.dueBack,
            status : req.body.status

        });

        if(!errors.isEmpty()) {
            BookInstance.find({}).exec((error, books) => {
                if(error) return next(error);

                res.render('./bookinstance/create', {
                    title: 'Create Book Instance',
                    bookList: books,
                    selectedBook: bookInstance.book._id,
                    bookInstance: bookInstance,
                    errors: errors.array() 
                });
            });

            return;

        } else {
            
            bookInstance.save((error) => {
                if(error) return next(error);
                // Saved Book and Redirect to Book Detail Page.
                res.redirect('./');
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The BookInstance Update Form
 */
exports.bookInstanceEdit = (req, res, next) => {
    res.send('BookInstance Update Form');
};

/**
 * Handle BookInstance Update Request 
 */
exports.bookInstanceUpdate = (req, res, next) => {
    res.send('bookInstance Update');
};

/**
 * Display The BookInstance Delete Form 
 */
exports.bookInstanceDeleteForm = (req, res, next) => {
    res.send('BookInstance Delete Form');
};

/**
 * Handle BookInstance Delete Request 
 */
exports.bookInstanceDelete = (req, res, next) => {
    res.send('BookInstance Delete');
};
