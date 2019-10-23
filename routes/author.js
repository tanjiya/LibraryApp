// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var AuthorController = require('../controllers/authorController');

// GET Request for List of All Author
router.get('/', AuthorController.authorList);

// GET Request for Single Author
router.get('/:id', AuthorController.authorDetail);

// GET Request for Creating a Author (Form)
router.get('/create', AuthorController.authorCreateForm);

// POST Request for Creating Author 
router.post('/create', AuthorController.authorCreate);

// GET Request to Update Author
router.get('/:id/update', AuthorController.authorUpdateForm);

// POST Request to Update Author
router.post('/:id/update', AuthorController.authorUpdate);

// GET Request to Delete Author
router.get('/:id/delete', AuthorController.authorDeleteForm);

// POST Request to Delete Author
router.post('/:id/delete', AuthorController.authorDelete);

module.exports = router;
