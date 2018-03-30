const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');

const routes = require('./routes');

// Initialize express Server
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Add middleware. Because we defined the first parameter ( '/api' ), it will run
// only for urls that starts with '/api/*'
app.use('/api', require('./routes/api/middlewares/auth.js'));


// enable cross-origin resource sharing
// https://enable-cors.org/ and https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  next();
});

// Route to the api
app.use(routes);

// Route to health check
app.get('/healthz', function (req, res) {
  // Docker purpose, return 200 if healthy, and anything else will fail!
  res.send('I am happy and healthy\n');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500);
  res.json({ 'error': err.message });
});

module.exports = app;