'use strict';

const data = require('./db/notes');

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/v1/notes', (req, res) => {
  const queryString = req.query.searchTerm;
  // 'data' is pulled from line 3, which links to the file with the 10 notes
  let notes = data.filter( note => note.title.includes(queryString)
  );
  res.json(notes);
});

app.get('/v1/notes/:id', (req, res) => {
  // the URL is always a string! 
  const id = parseInt(req.params.id);
  // if the parseInt() wasn't used, the below would be comparing a number to a string.
  const note = data.find(item => item.id === id); 
  res.json(note);
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

