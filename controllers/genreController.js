// Include Genre Model
const Genre = require('../models/genre');

// Display The List of All Genre
exports.genreList = async(req, res, next) => {
    try {
        const genreList = await Genre.find().exec();

        res.render('./genre/index', { title: 'Genre List', genreList: genreList});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Display The Details of a Genre
exports.genreDetail = (req, res, next) => {
    res.send('Genre Detail' + req.params.id);
};

// Display The Form of Genre Create
exports.genreCreateForm = (req, res, next) => {
    res.send('Genre Create Form');
};

// Handle Genre Create Request
exports.genreCreate = (req, res, next) => {
    res.send('Genre Create');
};

// Display The Genre Update Form
exports.genreUpdateForm = (req, res, next) => {
    res.send('Genre Update Form');
};

// Handle Genre Update Request
exports.genreUpdate = (req, res, next) => {
    res.send('Genre Update');
};


// Display The Genre Delete Form
exports.genreDeleteForm = (req, res, next) => {
    res.send('Genre Delete Form');
};

// Handle Genre Delete Request
exports.genreDelete = (req, res, next) => {
    res.send('Genre Delete');
};
