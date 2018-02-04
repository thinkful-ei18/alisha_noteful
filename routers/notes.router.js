'use strict';

/************************************* 
REQUIRED PROGRAMS/FRAMEWORKS
 *************************************/

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



/************************************* 
HANDLE ROUTES
 *************************************/

// GET
router.get('/notes', (req, res, next) => {

  const queryString = req.query.searchTerm;
  notes.filter(queryString)
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err));
});

router.get('/notes/:id', (req, res, next) => {
  // the URL is always a string! 
  const id = parseInt(req.params.id);
  // if the parseInt() wasn't used, the below would be comparing a number to a string.

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json('the requested note was not found');
      }
    })
    .catch(err => next(err));
});


// PUT
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];


  // this locates the updated info from the req body
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  // this passes that updated info to the client
  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});


// POST
router.post('/notes', (req, res, next) => {
  const newNote = req.body;
  if (!newNote.title || !newNote.content) {
    const err = new Error('Missing either the `title` or `content`');
    err.status = 400;
    return next(err);
  }

  notes.create(newNote)
    .then(note => {
      if (note) {
        res.location(`http://${req.headers.host}/notes/${note.id}`).status(201).json(note);
      } 
    })
    .catch(err => next(err));
});


// DELETE
router.delete('/notes/:id', (req, res, next) => {
  const deletedNote = req.params.id;
  if (!deletedNote) {
    const err = new Error("Can't find the note!");
    err.status = 404;
    return next(err);
  }

  notes.delete(deletedNote)
    .then(note => {
      if (note) {
        res.status(204).end();
      }
    })
    .catch(err => next(err));
});


/************************************* 
EXPOSED VARIABLES
 *************************************/

module.exports = router;