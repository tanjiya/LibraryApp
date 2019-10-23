// Include BookInstance Model
const BookInstance = require('../models/bookInstance');

// Display The List of All BookInstance
exports.bookInstanceList = async(req, res, next) => {
    try {
        const bookInstanceList = await BookInstance.find().exec();

        res.render('./bookinstance/index', { title: 'Book Instance List', bookInstanceList: bookInstanceList});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Display The Details of a BookInstance
exports.bookInstanceDetail = (req, res, next) => {
    res.send('BookInstance Detail' + req.params.id);
};

// Display The Form of BookInstance Create
exports.bookInstanceCreateForm = (req, res, next) => {
    res.send('BookInstance Create Form');
};

// Handle BookInstance Create Request
exports.bookInstanceCreate = (req, res, next) => {
    res.send('BookInstance Create');
};

// Display The BookInstance Update Form
exports.bookInstanceUpdateForm = (req, res, next) => {
    res.send('BookInstance Update Form');
};

// Handle BookInstance Update Request
exports.bookInstanceUpdate = (req, res, next) => {
    res.send('bookInstance Update');
};

// Display The BookInstance Delete Form
exports.bookInstanceDeleteForm = (req, res, next) => {
    res.send('BookInstance Delete Form');
};

// Handle BookInstance Delete Request
exports.bookInstanceDelete = (req, res, next) => {
    res.send('BookInstance Delete');
};
