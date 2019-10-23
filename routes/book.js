// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var BookController = require('../controllers/bookController');

// // GET Catalog Home Page.
// router.get('/', BookController.index);

// GET Request for List of All book
router.get('/', BookController.bookList);

// GET Request for Single Book
router.get('/:id', BookController.bookDetail);

// GET Request for Creating a Book (Form)
router.get('/create', BookController.bookCreateForm);

// POST Request for Creating Book 
router.post('/create', BookController.bookCreate);

// GET Request to Update Book
router.get('/:id/update', BookController.bookUpdateForm);

// POST Request to Update Book
router.post('/:id/update', BookController.bookUpdate);

// GET Request to Delete Book
router.get('/:id/delete', BookController.bookDeleteForm);

// POST Request to Delete book
router.post('/:id/delete', BookController.bookDelete);

module.exports = router;
