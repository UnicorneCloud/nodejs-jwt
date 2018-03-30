const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = function (req, res, next) {

  // Check if authorization header is set with a JWT valid
  if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
    try {
      // Decode JWT and keep user id (you can add more value)
      req.user = jwt.verify(req.headers['authorization'], 'secret'); // secret key here
    } catch (err) {
      // Invalid token
      return res.status(401).json({
        error: 'Failed to authenticate token!'
      });
    }
  } else {
    // No token present in header
    return res.status(401).json({
      error: 'No token!'
    });
  }
  next();
  return;
};
