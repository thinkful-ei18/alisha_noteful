'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);

/************************************* 
BASE TESTS
 *************************************/

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});


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



/************************************* 
HTTP METHOD TESTS
 *************************************/

describe('make sure API endpoints are passing and failing as expected', function () {


  // GET succeed/fail tests
  it('return all notes with GET', function () {
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

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {

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

    it('should respond with 404 when given a bad path', function () {
    
    });
  });


  // PUT succeed/fail tests
  it('update a note with PUT', function () {
    
  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {

    });
  });


  // DELETE succeed/fail tests
  it('delete a note with DELETE', function () {

  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {

    });
  });

});