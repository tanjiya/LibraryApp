// Include Required Model
const Book       = require('../models/book'),
    BookInstance = require('../models/bookInstance'),
    Author       = require('../models/author'),
    Genre        = require('../models/genre');
    
// Include Express Validator to Validate Data
const { body, sanitizeBody, validationResult } = require('express-validator');

/**
 * Display The Form of Book Create
 */
exports.bookCreateForm = async(req, res, next) => {
    try {
        // Get All Authors and Genres
        const authors = await Author.find(),
            genres    = await Genre.find();
    
        res.render('./book/form', {
            title  : 'Create Book',
            authors: authors,
            genres : genres
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to Validate Data
 */
exports.validate = (method) => {
    switch(method) {
        case 'bookCreate' :
        case 'bookUpdate' : {
            return [
                // Validate Data
                body('title', 'Title is Required')
                    .isLength({ min:3, max:30 })
                    .trim(),
                body('author', 'Author is Required')
                    .isLength({ min:3, max:30 })
                    .trim(),
                body('summary', 'Summary is Required')
                    .isLength({ min:3, max:400 })
                    .trim(),
                body('isbn')
                    .isLength({ min:3, max:12 })
                    .trim(),

                // Sanitize Data (using wildcard: sanitizeBody('*').escape())
                sanitizeBody('title').escape(),
                sanitizeBody('author').escape(),
                sanitizeBody('summary').escape(),
                sanitizeBody('isbn').escape(),
                sanitizeBody('genre.*').escape(),
            ];
        }
        break;
    }
};

/**
 *Convert Genre to An Array
 */
const genreArray = (req, res, next) => {
    let genreReq = req.body.genre;

    if(!(genreReq instanceof Array)) {
        if(typeof genreReq === 'undefined') {
            genreReq = [];
        } else {
            genreReq = new Array(genreReq);
        }
    }

    next();
};

/**
 * Handle Book Create Request
 */
exports.bookCreate = [
    genreArray,
    async(req, res, next) => {
        try {
            const errors = validationResult(req);
    
            const book = new Book({
                title   : req.body.title,
                author  : req.body.author,
                summary : req.body.summary,
                isbn    : req.body.isbn,
                genre   : req.body.genre,
            });
    
            if (!errors.isEmpty()) {
                const authors = await Author.find(),
                    genres = await Genre.find();
    
                // Mark Selected Genres as Checked
                for (let i = 0; i < genres.length; i++) {
                    if (book.genre.indexOf(genres[i]._id) > -1) {
                        genres[i].checked = 'true';
                    }
                }

                if (authors != null && genres != null) {
                    res.render('./book/form', {
                        title   : 'Create Book',
                        authors : authors,
                        genres  : genres,
                        book    : book,
                        errors  : errors.array()
                    });
                }
    
            } else {
                await Book.findOne({ 'title':  req.body.title }).exec((error, bookExists) => {
                    if(error) return next(error);
    
                    if (bookExists) {
                        res.redirect(bookExists.url);
                    } else {
                        book.save((error) => {
                            if (error) return next(error);

                            res.redirect('./');
                        });
                    }
                });
            }
        } catch (error) {
            next(error);  
        }
    }
];

/**
 * Display The Book Update Form
 */
exports.bookEdit = async(req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(),
            authors = await Author.find(),
            genres  = await Genre.find();
        
        if(book === null) {
            let error = new Error('Book not Found');
            error.status = 404;

            return next(error);
        } else {
            // Mark Selected Genres as Checked
            for (let i = 0; i < genres.length; i++) {
                for (let j = 0; j < book.genre.length; j++) {
                    if (genres[i]._id.toString() == book.genre[j]._id.toString()) genres[i].checked='true';
                }
            }

            res.render("./book/form", {
                title  : 'Update Book: ' + book.title,
                authors: authors,
                genres : genres,
                book   : book
            });
        }
    } catch (error) {
        next(error); 
    }
};

/**
 * Handle Book Update Request
 */
exports.bookUpdate = [
    genreArray,
    async(req, res, next) => {
        try {
            const errors = validationResult(req);

            const book = new Book({
                title  : req.body.title,
                author : req.body.author,
                summary: req.body.summary,
                isbn   : req.body.isbn,
                genre  : (typeof req.body.genre === 'undefined') ? []  : req.body.genre,
                _id    : req.params.id
            });

            if(!errors.isEmpty()) {
                const authors = await Author.find(),
                    genres = await Genre.find();

                // Mark Selected Genres as Checked
                for (let i = 0; i < genres.length; i++) {
                    if (book.genre.indexOf(genres[i]._id) > -1) genres[i].checked = 'true';
                }

                res.render('./book/form', {
                    title   : 'Update Book: ' + book.title,
                    authors : authors,
                    genres  : genres,
                    book    : book,
                    errors  : errors.array()
                });

            } else {
                await Book.findByIdAndUpdate(req.params.id, book, {}, (error, book) => {
                    if(error) next(error);

                    res.redirect('./');
                });
            }
        } catch (error) {
            next(error); 
        }
    }
];

/**
 * Display The Book Delete Form
 */
exports.bookDeleteForm = async(req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).exec(),
            instance = await BookInstance.find({'book': req.params.id}).exec();
            
        if (book == null) {
            res.redirect('./book');
        } else {
            // Successful, so render delete form.
            res.render('./book/delete', {
                title: 'Delete Book',
                book: book,
                bookInstance: instance
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Handle Book Delete Request
 */
exports.bookDelete = async(req, res, next) => {
    try {
        const book = await Book.findById(req.body.bookId).exec(),
            instance = await BookInstance.find({ 'book': req.body.bookId }).exec();
            
        if(instance.length > 0) {
            res.render('./book/delete', {
                title: 'Delete Author',
                book: book,
                bookInstance: instance
            });
        } else {
            const deleteBook = (error) => {
                if(error) return next(error);

                res.redirect('/book');
            };
            await Book.findByIdAndRemove(req.body.bookId, deleteBook);
            }
    } catch (error) {
        next(error);
    }
};

/**
 * Display The List of All Book
 */
exports.bookList = async(req, res, next) => {
    try {
        await Book.find({}).populate('author').exec((err, bookList) => {
            if (err) return bookInstanceList;

            // console.log(bookList);

            res.render('./book/index', { title: 'Book List', bookList: bookList});
        });

        // res.render('./book/index', { title: 'Book List', bookList: bookList});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Details of a Book
 */
exports.bookDetail = async(req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(),
            instance = await BookInstance.find({'book': req.params.id}).exec();
        
        if(book == null) {
            const error = new Error('Book not Found');
            error.status = 404;
            return next(error);
        } else {
            res.render('./book/detail', {
                title: 'Book Details',
                book: book,
                bookInstance: instance
            });
        }
    } catch (error) {
        next(error);
    }
};
