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
  notes.filter(queryString, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

router.get('/notes/:id', (req, res, next) => {
  // the URL is always a string! 
  const id = parseInt(req.params.id);
  // if the parseInt() wasn't used, the below would be comparing a number to a string.

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


// UPDATE
router.put('/notes/:id', (req, res, next) => {
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

/************************************* 
EXPOSED VARIABLES
 *************************************/

module.exports = router;