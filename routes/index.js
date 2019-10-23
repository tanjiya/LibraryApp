// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var HomeController = require('../controllers/homeController');

// Get Home Page of The Web Application
router.get('/', HomeController.home);

// Include All Routes
router.use('/author', require('./author'));
router.use('/book', require('./book'));
router.use('/bookinstance', require('./bookInstance'));
router.use('/genre', require('./genre'));

router.use('/users', require('./users'));

module.exports = router;
