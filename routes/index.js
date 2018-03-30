'use strict';

// Routes
var express = require('express');
var router = express.Router();

// Api routes
router.use('/api', require('./api'));
router.use('/login', require('./login'));

module.exports = router;
