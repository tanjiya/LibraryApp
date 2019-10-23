// Include Author Model
const Author = require('../models/author');

// Display The List of All Author
exports.authorList = async(req, res, next) => {
    try {
        const authorList = await Author.find().exec();

        res.render('./author/index', { title: 'Author List', authorList: authorList});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Display The Details of a Author
exports.authorDetail = (req, res, next) => {
    res.send('Author Details ' + req.params.id);
};

// Display The Form of Author Create
exports.authorCreateForm = (req, res, next) => {
    res.send('Author Create Form');
};

// Handle Author Create Request
exports.authorCreate = (req, res, next) => {
    res.send('Author Create');
};

// Display The Author Update Form
exports.authorUpdateForm = (req, res, next) => {
    res.send('Author Update Form');
};

// Handle Author Update Request
exports.authorUpdate = (req, res, next) => {
    res.send('Author Update');
};

// Display The Author Delete Form
exports.authorDeleteForm = (req, res, next) => {
    res.send('Author Delete Form');
};

// Handle Author Delete Request
exports.authorDelete = (req, res, next) => {
    res.send('Author Delete');
};
