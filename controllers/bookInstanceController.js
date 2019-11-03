// Include Required Model
const BookInstance = require('../models/bookInstance'),
    Book           = require('../models/book');
// Include Express Validator to Validate Data
const { body, sanitizeBody, validationResult } = require('express-validator');

/**
 * Display The Form of BookInstance Create 
 */
exports.bookInstanceCreateForm = async(req, res, next) => {
    try {
        await Book.find({}).exec((error, books) => {
            if(error) return next(error);
    
            res.render('./bookinstance/form', {
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
        case 'bookInstanceCreate': 
        case 'bookInstanceUpdate': {
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

        const bookInstance = new BookInstance({
            book   : req.body.book,
            imprint: req.body.imprint,
            dueBack: req.body.dueBack,
            status : req.body.status
        });

        if(!errors.isEmpty()) {
            await BookInstance.find({}).exec((error, books) => {
                if(error) return next(error);

                res.render('./bookinstance/form', {
                    title: 'Create Book Instance',
                    bookList: books,
                    selectedBook: bookInstance.book._id,
                    bookInstance: bookInstance,
                    errors: errors.array() 
                });
            });
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
exports.bookInstanceEdit = async(req, res, next) => {
    // async.parallel({
    //     bookInstance: (callback) => {
    //         BookInstance.findById(req.params.id)
    //             .populate('book')
    //             .exec(callback);
    //     },
    //     books: (callback) => {  
    //         Book.find(callback);
    //     }
    // }, (error, values)  => {
    //     if(error) return next(error);

    //     if(values.bookInstance == null) {
    //         let error = new Error('Book Instance not Found');
    //         error.status = 404;
    //         return next(error);
    //     } else {
    //         res.render('./bookinstance/form', {
    //             title: 'Update Book Instance',
    //             bookList: values.books,
    //             selectedBook: values.bookInstance.book._id,
    //             bookInstance: values.bookInstance,
    //         });
    //     }
    // });

    // // By using Promise
    // const [bookInstance, books] = await Promise.all([
    //     BookInstance.findById(req.params.id).populate('book'),
    //     Book.find()
    // ]);

    try {
        const bookInstance = await BookInstance.findById(req.params.id).populate('book').exec(),
            books = await Book.find();

        if(bookInstance == null) {
            let error = new Error('Book Instance not Found');
            error.status = 404;
            return next(error);
        } else {
            res.render('./bookinstance/form', {
                title: 'Update Book Instance',
                bookList: books,
                selectedBook: bookInstance.book._id,
                bookInstance: bookInstance,
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Handle BookInstance Update Request 
 */
exports.bookInstanceUpdate = async(req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        dueBack: req.body.dueBack,
        _id: req.params.id
    });

    if(!errors.isEmpty()) {
        await Book.find({}).exec((error, book) => {
            if(error) return next(error);

            res.render('./bookinstance/form', {
                title: 'Book Instance Update',
                bookList: book,
                selectedBook: bookInstance.book._id,
                errors: errors.array(),
            });
        });

        return;
    } else {
        await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {}, (error, bookInstance) => {
            if (error) return next(error);

            res.redirect('./');
        });
    }
};

/**
 * Display The BookInstance Delete Form 
 */
exports.bookInstanceDeleteForm = async(req, res, next) => {
    try {
        const bookInstance = await BookInstance.findById(req.params.id).populate('book').exec();

        if(bookInstance == null) {
            res.redirect('./bookinstance');
        } else {
            // Successful
            res.render('./bookinstance/delete', {
                title: 'Delete Book Instance: ' + bookInstance.book.title,
                bookInstance: bookInstance
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Handle BookInstance Delete Request 
 */
exports.bookInstanceDelete = async(req, res, next) => {
    try {
        const deleteBookInstance = (error) => {
            if(error) return next(error);

            res.redirect('/bookinstance');
        };

        await BookInstance.findByIdAndRemove(req.body.bookInstanceId, deleteBookInstance);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
            // Successful
            res.render('./bookinstance/detail', {
                title: 'Copy: ' + bookInstance.book.title,
                bookInstance: bookInstance
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
