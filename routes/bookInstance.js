// Include Express Module
const express = require('express'),
    router    = express.Router();

// Include Controller
var BookInstanceController = require('../controllers/bookInstanceController');

// GET Request for Creating a BookInstance (Form)
router.get('/create', BookInstanceController.bookInstanceCreateForm);

// POST Request for Creating BookInstance 
router.post('/create', BookInstanceController.validate('bookInstanceCreate'), BookInstanceController.bookInstanceCreate);

// GET Request to Update BookInstance
router.get('/:id/edit', BookInstanceController.bookInstanceEdit);

// POST Request to Update BookInstance
router.post('/:id/edit', BookInstanceController.validate('bookInstanceUpdate'), BookInstanceController.bookInstanceUpdate);

// GET Request to Delete BookInstance
router.get('/:id/delete', BookInstanceController.bookInstanceDeleteForm);

// POST Request to Delete BookInstance
router.post('/:id/delete', BookInstanceController.bookInstanceDelete);

// GET Request for List of All BookInstance
router.get('/', BookInstanceController.bookInstanceList);

// GET Request for Single BookInstance
router.get('/:id', BookInstanceController.bookInstanceDetail);

module.exports = router;
