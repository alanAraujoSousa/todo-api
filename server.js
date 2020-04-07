require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const cors = require('cors');
const logger = require('morgan');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const environment = process.env.NODE_ENV;

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/user.controller'));

if (environment !== 'production') {
  app.use(logger('dev'));
}


// start server
const port = environment === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('The todo-api is listening on port ' + port);
});

module.exports = app