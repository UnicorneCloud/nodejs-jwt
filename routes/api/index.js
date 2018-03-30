'use strict';

var express = require('express');
var router = express.Router();

router.use('/helloworld', require('./helloworld'));

module.exports = router;