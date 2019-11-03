// Include Express Module
const express = require('express'),
    router    = express.Router();

// Include Controller
var BookController = require('../controllers/bookController');

// GET Request for Creating a Book (Form)
router.get('/create', BookController.bookCreateForm);

// POST Request for Creating Book 
router.post('/create', BookController.validate('bookCreate'), BookController.bookCreate);

// GET Request to Update Book
router.get('/:id/edit', BookController.bookEdit);

// POST Request to Update Book
router.post('/:id/edit', BookController.validate('bookUpdate'), BookController.bookUpdate);

// GET Request to Delete Book
router.get('/:id/delete', BookController.bookDeleteForm);

// POST Request to Delete book
router.post('/:id/delete', BookController.bookDelete);

// GET Request for List of All book
router.get('/', BookController.bookList);

// GET Request for Single Book
router.get('/:id', BookController.bookDetail);

module.exports = router;
