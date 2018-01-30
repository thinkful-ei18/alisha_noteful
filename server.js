'use strict';

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();
const {PORT} = require('./config');
const {logger} = require('./middlewares/logger');

app.use(express.static('public'));
app.use(express.json());

app.use(logger);

app.get('/v1/notes', (req, res, next) => {

  const queryString = req.query.searchTerm;
  notes.filter(queryString, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.get('/v1/notes/:id', (req, res, next) => {
  // the URL is always a string! 
  const id = parseInt(req.params.id);
  // if the parseInt() wasn't used, the below would be comparing a number to a string.
  // const note = data.find(item => item.id === id); 
  // res.json(note);

  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      res.json('not found');
    }
  });
});

app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id; 

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content']; // these are key names in each note object

  // this locates the updated info from the req body
  updateFields.forEach(field => { // iterate over the 2 fields above
    if (field in req.body) { // if the current field is in the req.body that was sent in the PUT method...(which contains updated content)
      updateObj[field] = req.body[field]; // then assign the key/field inside the empty updateObg to the value of the updated field in the req body.
      // i.e., if the title was updated, then updateObj = {title: 'new title'}
    }
  });

  // this passes that updated info to the client
  notes.update(id, updateObj, (err, item) => { // item is defined on line 76 of simDB.js. it's the note that matches the id that was passed in
    if (err) { // if there's an error
      return next(err); // give that error to the error handler below
    }
    if (item) { // if there is a valid note
      res.json(item); // pass the note back in json to the client
    } else { // otherwise
      next(); // do the next thing
    }
  });
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

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

