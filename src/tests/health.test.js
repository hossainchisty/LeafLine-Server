const request = require('supertest');

const app = require('../app');

// This block of code is a test suite for the HTTP GET request to the root endpoint ('/') of a web application.
describe('GET /', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ statusCode: 200, success: true, message: 'Health OK' }, done);
  });
});
