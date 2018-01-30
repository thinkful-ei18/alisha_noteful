'use strict';

function logger(req, res, next) {
  console.log('logging the request');
  console.log(`${new Date()} : ${req.method} : ${req.url}`);
  next();
}

module.exports = {logger};