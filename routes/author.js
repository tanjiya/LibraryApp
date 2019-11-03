// Include Express Module
const express = require('express'),
    router    = express.Router();

// Include Controller
var AuthorController = require('../controllers/authorController');

// GET Request for Creating a Author (Form)
router.get('/create', AuthorController.authorCreateForm);

// POST Request for Creating Author 
router.post('/create', AuthorController.validate('authorCreate'), AuthorController.authorCreate);

// GET Request to Update Author
router.get('/:id/edit', AuthorController.authorEdit);

// POST Request to Update Author
router.post('/:id/edit',AuthorController.validate('authorUpdate') , AuthorController.authorUpdate);

// GET Request to Delete Author
router.get('/:id/delete', AuthorController.authorDeleteForm);

// POST Request to Delete Author
router.post('/:id/delete', AuthorController.authorDelete);

// GET Request for List of All Author
router.get('/', AuthorController.authorList);

// GET Request for Single Author
router.get('/:id', AuthorController.authorDetail);

module.exports = router;
