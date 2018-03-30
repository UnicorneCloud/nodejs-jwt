'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');

var router = express.Router();

router.route('/')
  .get(asyncHandler(async (req, res, next) => {
    res.status(200).json({ message: 'Helloworld' });
  }))

module.exports = router;
