const express = require('express'),
  router      = express.Router();

/* GET Users Listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
