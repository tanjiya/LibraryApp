// Include Express Module
const express      = require('express'),
    router         = express.Router(),
    HomeController = require('../controllers/homeController'); // Include Controller


// Get Home Page of The Web Application
router.get('/', HomeController.home);

// Include All Routes
router.use('/author', require('./author'));
router.use('/book', require('./book'));
router.use('/bookinstance', require('./bookInstance'));
router.use('/genre', require('./genre'));

router.use('/users', require('./users'));

module.exports = router;
