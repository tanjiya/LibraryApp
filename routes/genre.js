// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var GenreController = require('../controllers/genreController');

// GET Request for List of All Genre
router.get('/', GenreController.genreList);

// GET Request for Single Genre
router.get('/:id', GenreController.genreDetail);

// GET Request for Creating a Genre (Form)
router.get('/create', GenreController.genreCreateForm);

// POST Request for Creating Genre 
router.post('/create', GenreController.genreCreate);

// GET Request to Update Genre
router.get('/:id/update', GenreController.genreUpdateForm);

// POST Request to Update Genre
router.post('/:id/update', GenreController.genreList);

// GET Request to Delete Genre
router.get('/:id/delete', GenreController.genreDeleteForm);

// POST Request to Delete Genre
router.post('/:id/delete', GenreController.genreDelete);

module.exports = router;
