'use strict';

console.log('hello world!');

/************************************* 
REQUIRED PROGRAMS/FRAMEWORKS
 *************************************/

const express = require('express');
const morgan = require('morgan');
const { PORT } = require('./config');
const notesRouter = require('./routers/notes.router');

// create express app
const app = express();

// log all request
app.use(morgan('dev'));

// create a static webserver
app.use(express.static('public'));
app.use(express.json());
app.use('/v1', notesRouter);

/************************************* 
 ERROR HANDLING 
 *************************************/

app.get('/throw', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

/************************************* 
LISTENER
 *************************************/

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

