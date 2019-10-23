// Include Book Model
const Book = require('../models/book');

// Display The List of All Book
exports.bookList = async(req, res, next) => {
    try {
        const bookList = await Book.find().exec();

        res.render('./book/index', { title: 'Book List', bookList: bookList});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Display The Details of a Book
exports.bookDetail = (req, res, next) => {
    res.send('Book Detail' + req.params.id);
};

// Display The Form of Book Create
exports.bookCreateForm = (req, res, next) => {
    res.send('Book Create Form');
};

// Handle Book Create Request
exports.bookCreate = (req, res, next) => {
    res.send('Book Create');
};

// Display The Book Update Form
exports.bookUpdateForm = (req, res, next) => {
    res.send('Book Update Form');
};

// Handle Book Update Request
exports.bookUpdate = (req, res, next) => {
    res.send('Book Update');
};

// Display The Book Delete Form
exports.bookDeleteForm = (req, res, next) => {
    res.send('Book Delete Form');
};

// Handle Book Delete Request
exports.bookDelete = (req, res, next) => {
    res.send('Book Delete');
};
