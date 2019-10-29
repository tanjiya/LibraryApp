// Include Required Model
const Book       = require('../models/book'),
    BookInstance = require('../models/bookInstance'),
    Author       = require('../models/author'),
    Genre        = require('../models/genre'),
    async        = require('async'); // Include Async Module
// Include Express Validator to Validate Data
const {body, sanitizeBody, validationResult} = require('express-validator');

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
exports.bookDetail = (req, res, next) => {
    try {
        async.parallel({
            book: (callback) => {
                Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(callback);
            },
            instance: (callback) => {
                BookInstance.find({'book': req.params.id}).exec(callback);
            }
        }, (error, values) => {
            if(error) return next(error);

            if(values.book == null) {
                const error = new Error('Book not Found');
                error.status = 404;

                return next(error);
            }
            res.render('./book/detail', {title: 'Book Details', error: error, book: values.book, bookInstance: values.instance});
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Form of Book Create
 */
exports.bookCreateForm = (req, res, next) => {
    try {
        // Get All Authors and Genres
        async.parallel({
            authors: (callback) => {
                Author.find(callback);
            },
            genres: (callback) => {
                Genre.find(callback);
            },
        }, (error, values) => {
            if(error) return next(error);
    
            res.render('./book/create', {
                title  : 'Create Book',
                authors: values.authors,
                genres : values.genres
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
    switch(method) {
        case 'bookCreate' : {
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
            ];
        }
        break;

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
    
            const book = await new Book({
                title   : req.body.title,
                author  : req.body.author,
                summary : req.body.summary,
                isbn    : req.body.isbn,
            });
    
            if (!errors.isEmpty()) {
                async.parallel({
                    // Get All Authors and Genres
                    authors: (callback) => {
                        Author.find(callback);
                    },
                    genres: (callback) => {
                        Genre.find(callback);
                    },
                }, (error, values) => {
                    if(error) return next(error);
    
                    // Mark Selected Genres as Checked
                    for (let index = 0; index < values.genres.length; index++) {
                        if (book.genre.indexOf(values.genres[index]._id) > -1) values.genres[index].checked = 'true';
                    }
    
                    res.render('./book/create', {
                        title   : 'Create Book',
                        authors : values.authors,
                        genres  : values.genres,
                        book    : book,
                        errors  : errors.array()
                    });
                });
    
                return;
    
            } else {
                Book.findOne({ 'title':  req.body.title}).exec((error, bookExists) => {
                    if(error) return next(error);
    
                    if (bookExists) {
                        res.redirect(bookExists.url);
                    } else {
                        book.save((error) => {
                            if(error) return next(error);
                            // Saved Book and Redirect to Author Detail Page.
                            res.redirect('./');
                        });
                    }
                });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });  
        }
    }
];

/**
 * Display The Book Update Form
 */
exports.bookEdit = (req, res, next) => {
    try {
        async.parallel({
            book: (callback) => {
                Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(callback);
            },
            authors: (callback) => {
                Author.find(callback);
            },
            genres: (callback) => {
                Genre.find(callback);
            }
        }, (error, values)  => {
            if(error) return next(error);

            if(values.book === null) {
                let error = new Error('Book not Found');
                error.status = 404;

                return next(error);
            } else {
                // Mark Selected Genres as Checked
                for (let i = 0; i < values.genres.length; i++) {
                    for (let j = 0; j < values.book.genre.length; j++) {
                        if (values.genres[i]._id.toString() == values.book.genre[j]._id.toString()) values.genres[i].checked='true';
                    }
                }

                res.render("./book/edit", {
                    title  : 'Update Book: ' + values.book.title,
                    authors: values.authors,
                    genres : values.genres,
                    book   : values.book
                });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

/**
 * Handle Book Update Request
 */
exports.bookUpdate = [
    genreArray,
    async(req, res, next) => {
        const errors = validationResult(req);

        const book = await new Book({
            title  : req.body.title,
            author : req.body.author,
            summary: req.body.summary,
            isbn   : req.body.isbn,
            genre  : (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
            _id    : req.body.id
        });

        if(!errors.isEmpty()) {
            async.parallel({
                // Get All Authors and Genres
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genre.find(callback);
                },
            }, (error, values) => {
                if(error) return next(error);

                // Mark Selected Genres as Checked
                for (let index = 0; index < values.genres.length; index++) {
                    if (book.genre.indexOf(values.genres[index]._id) > -1) values.genres[index].checked = 'true';
                }

                res.render('./book/edit', {
                    title  : 'Update Book: ' + values.book.title,
                    authors : values.authors,
                    genres  : values.genres,
                    book    : book,
                    errors  : errors.array()
                });
            });

            return;
        } else {
            Book.findByIdAndUpdate(req.params.id, {}, (error, book) => {
                if(error) next(error);

                res.redirect('./');
            });
        }
    }
];

/**
 * Display The Book Delete Form
 */
exports.bookDeleteForm = (req, res, next) => {
    res.send('Book Delete Form');
};

/**
 * Handle Book Delete Request
 */
exports.bookDelete = (req, res, next) => {
    res.send('Book Delete');
};
