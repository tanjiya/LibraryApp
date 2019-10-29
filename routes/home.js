// Include Express Module
const express      = require('express'),
    router         = express.Router(),
    HomeController = require('../controllers/homeController'); // Include Controller

// Get Home Page of The Web Application
router.get('/', HomeController.home);

module.exports = router;
