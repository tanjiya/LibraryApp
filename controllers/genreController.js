// Include Required Model
const Genre = require('../models/genre'),
    Book    = require('../models/book');
// Include Express Validator to Validate Data
const {body, sanitizeBody, validationResult} = require('express-validator');

/**
 * Display The Form of Genre Create
 */
exports.genreCreateForm = (req, res, next) => {
    res.render('./genre/form', { title: 'Create Genre' });
};

/**
 * Middleware to Validate Data 
 */
exports.validate = (method) => {
    switch (method) {
        case 'genreCreate':
        case 'genreUpdate': {
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
        break;
    }
};

/**
 * Handle Genre Create Request
 */
exports.genreCreate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        const genre  = new Genre({
            name : req.body.name
        });

        if(!errors.isEmpty()) {
            res.render('./genre/form', {
                title : 'Create Genre',
                genre : genre,
                errors: errors.array()
            });
        } else {
            await Genre.findOne({ 'name': req.body.name }).exec((error, genreExists) => {
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
exports.genreEdit = async(req, res, next) => {
    try {
        await Genre.findById(req.params.id, (error, genre) => {
            if(error) return next(error);
    
            if(genre === null) {
                let error = new Error('Genre not Found');
                error.status = 404;
                return next(error);
            } else {
                res.render('./genre/form', {
                    title: 'Update Genre',
                    genre: genre,
                });
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle Genre Update Request
 */
exports.genreUpdate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            res.render('./genre/form', {
                title: 'Update Genre',
                genre: genre,
                errors: errors.array()
            });

            return;
        } else {
            await Genre.findByIdAndUpdate(req.params.id, genre, {}, (error, genre) => {
                if(error) return next(error);

                res.redirect('./');
            }); 
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Display The Genre Delete Form
 */
exports.genreDeleteForm = async(req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id).exec(),
            books = await Book.find({ 'book': req.params.id }).exec();

        if(genre == null) res.redirect('./genre');

        res.render('./genre/delete', {
            title: "Delete Genre",
            genre: genre,
            genreBooks: books
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle Genre Delete Request
 */
exports.genreDelete = async(req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id).exec(),
            books = await Book.find({ 'book': req.params.id }).exec();

        if(books.length > 0) {
            res.render('./genre/delete', {
                title: 'Delete Genre',
                genre: genre,
                genreBooks: books
            });
        } else {
            const deleteGenre = (error) => {
                if(error) return next(error);

                res.redirect('/genre');
            };

            await Genre.findByIdAndRemove(req.body.genreId, deleteGenre);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Display The List of All Genre
 */
exports.genreList = async(req, res, next) => {
    try {
        await Genre.find({}).exec((error, genreList) => {
            if (error) return genreList;

            // console.log(genreList);
        
            res.render('./genre/index', {
                title: 'Genre List',
                genreList: genreList
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Display The Details of a Genre
 */
exports.genreDetail = async(req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id).exec(),
            books = await Book.find({ 'genre': req.params.id }).exec();

        if(genre == null) {
            const error = new Error('Genre not Found');
            error.status = 404;

            return next(error);
        }
        // Successful
        res.render('./genre/detail', {
            title: 'Book Genre Details',
            genre: genre,
            genreBooks: books
        });
    } catch (error) {
        next(error);
    }
};
