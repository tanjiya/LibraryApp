// Include Express Module
const express = require('express');
// Include Express Router
const router = express.Router();

// Include Controller
var HomeController = require('../controllers/homeController');

// Get Home Page of The Web Application
router.get('/', HomeController.home);

module.exports = router;
