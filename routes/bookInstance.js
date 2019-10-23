// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var BookInstanceController = require('../controllers/bookInstanceController');

// GET Request for List of All BookInstance
router.get('/', BookInstanceController.bookInstanceList);

// GET Request for Single BookInstance
router.get('/:id', BookInstanceController.bookInstanceDetail);

// GET Request for Creating a BookInstance (Form)
router.get('/create', BookInstanceController.bookInstanceCreateForm);

// POST Request for Creating BookInstance 
router.post('/create', BookInstanceController.bookInstanceCreate);

// GET Request to Update BookInstance
router.get('/:id/update', BookInstanceController.bookInstanceUpdateForm);

// POST Request to Update BookInstance
router.post('/:id/update', BookInstanceController.bookInstanceList);

// GET Request to Delete BookInstance
router.get('/:id/delete', BookInstanceController.bookInstanceDeleteForm);

// POST Request to Delete BookInstance
router.post('/:id/delete', BookInstanceController.bookInstanceDelete);

module.exports = router;
