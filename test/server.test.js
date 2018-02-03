'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);

/************************************* 
TEST MAKE SURE NPM IS WORKING
 *************************************/

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

/*

successful tests:
GET - search - '/v1/notes'
GET - details - '/v1/notes/id'
PUT - update - '/v1/notes/id'
POST - create - '/v1/notes'
DELETE - delete - '/v1/notes/id'

bad tests:
try to get a note with an invalid id
try to create a note without both completed properties
try to delete a note with an invalid id
try to update a note that ...

*/

/************************************* 
NOTEFUL ROUTE TESTS
 *************************************/

/************** GET TESTS **************/
describe('All GET tests', function() {

  describe('Express static', function () {
    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });


  describe('404 handler', function () {
    it('should respond with 404 when given a bad path', function () {
      const spy = chai.spy();
      return chai.request(app)
        .get('/bad/path')
        .then(spy)
        .then(() => {
          expect(spy).to.not.have.been.called();
        })
        .catch(err => {
          expect(err.response).to.have.status(404);
        });
    });
  });


  describe('GET from v1/notes', function () {

    it('returns all notes with GET', function () {
      return chai.request(app)
        .get('/v1/notes')
        .then(function (res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.be.above(2);

          res.body.forEach(function (note) {
            expect(note).to.be.a('object');
            expect(note).to.have.all.keys('title', 'content', 'id');
          });
        });
    });

    it('returns notes based on search query', function() {
      return chai.request(app)
        .get('/v1/notes?searchTerm=ways')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].id).to.equal(1005);
        });
    });

    it('returns an error because the id is not valid', function() {
      const spy = chai.spy();
      return chai.request(app)
        .get('/v1/notes/9999')
        .then(spy)
        .then(() => {
          expect(spy).to.not.have.been.called();
        })
        .catch(err => {
          expect(err.response).to.have.status(404);
        });
    });

  });



  // POST succeed/fail tests
  it('create a new note with POST', function () {
    const newNote = {
      title: 'new note',
      content: 'new content'
    };

    return chai.request(app)
      .post('/v1/notes')
      .send(newNote) // ??
      .then(function (res) {
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('title', 'content', 'id');
        expect(res.body).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newNote, {
          id: res.body.id
        }));
      });
  });

  describe('404 handler', function () {

    it('returns an error if the title and content are not included', function () {
      const newNote = {
        title: 'new note',
        content: 'new content'
      };

      const spy = chai.spy();
      return chai.request(app)
        .post('/v1/notes')
        .send(newNote)
        .then(spy)
        .then(() => {
          expect(spy).to.not.have.been.called();
        })
        .catch((err) => {
          const res = err.response;
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('New notes must contain a title and content');
        });
    });
  });


  // PUT succeed/fail tests
  it.only('update a note with PUT', function () {
    const updateNote = {
      title: 'new note',
      content: 'new content'
    };

    return chai.request(app)
      .get('/v1/notes')
      .then(function(res) {
        updateNote.id = res.body[0].id;

        return chai.request(app)
          .put(`/v1/notes/${updateNote.id}`)
          .send(updateNote);
      })
      .then(function(res) {
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateNote);
      });
  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      
    });
  });


  // DELETE succeed/fail tests
  it('delete a note with DELETE', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/v1/notes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      
    });
  });

});