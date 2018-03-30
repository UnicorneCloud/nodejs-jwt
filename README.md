# nodejs-jwt

Nodejs app with [expressjs](http://expressjs.com/) RESTAPI and [JSON Web Token](https://jwt.io/) to check authentification sample.

## Before the start

Clone this repository and run:

```bash
npm install
npm start
```

## Use case with nodejs server and curl client

Send a login request with curl and add two parameters:

* admin = admin@admin.com
* password = admin

```bash
curl -d "email=admin@admin.com&password=admin" -X POST http://localhost:8080/login
```

A valid token is returned:

```json
{
  "email":"admin@admin.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE1MjI0MjEyODAsImV4cCI6MTUyMjQyNDg4MH0.Lt4zggS4xv_nFru_Vvob_S1KGIAHth_ifxr6g4VN5R0"
}
```

Use that token to send next request to the API at [http://localhost:8080/api/helloworld](http://localhost:8080/api/helloworld)

```bash
curl -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE1MjI0MjEyODAsImV4cCI6MTUyMjQyNDg4MH0.Lt4zggS4xv_nFru_Vvob_S1KGIAHth_ifxr6g4VN5R0" -X GET "http://localhost:8080/api/helloworld"
```

The server check if a valid token is present in Authorization header and returns a HelloWorld:

```json
{"message":"Helloworld"}
```

Try with an invalid token:

```bash
curl -H "Authorization: wrong-token" -X GET "http://localhost:8080/api/helloworld"
```

The server returns a token error:

```json
{"error":"Failed to authenticate token!"}
```

## Project description

Install the jsonwebtoken:

```bash
npm install jsonwebtoken --save
```

Create a middleware *auth.js* to check JWT. Change the *secret* by what do you want.

```javascript
// ./routes/api/middlewares/auth.js

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
```

Add this middleware to the /api/ route in *app.js*.

```javascript
// ./app.js

[...]

// Add middleware. Because we defined the first parameter ( '/api' ), it will run
// only for urls that starts with '/api/*'
app.use('/api', require('./routes/api/middlewares/auth.js'));

[...]
```

Add a login router to generate the token.

```javascript
// ./routes/login.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var router = express.Router();
router.route('/')

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
```