'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const fs = require('fs');


var router = express.Router();
router.route('/')
  /**
   * @api {post} /api/login Login
   * @apiGroup Login
   * @apiName Login a user
   * @apiDescription Login a user in the system and return valid token (JWT). This
   * post use POST application/x-www-form-urlencoded.
   *
   * @apiParam {String} email       User email.
   * @apiParam {String} password    Description.
   *
   */
  .post(asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // check login information
    if (email === 'admin@admin.com' && password === 'admin') {
      // build json response with JWT valid token
      let user = {
        email: email,
        token: jwt.sign({
          id: '1',
        }, 'secret', { expiresIn: 60 * 60 }) // use secret key
      }
      res.status(200).json(user);
    }
    else {
      res.status(401).json({
        error: 'wrong username or password!'
      });
    }
  }))

module.exports = router;
