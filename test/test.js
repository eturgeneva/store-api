const { app } = require('../app');
const request = require('supertest');
// const { it, describe } = require('node:test');

let user = {};
let isAuthenticated = true;

// Can be inside a test
// Adds this middleware as the first one in the middleware stack
// app.stack.unshift({
//     route: '',
//     handle: function (req, res, next) {
//         req.user = user;

//         req.isAuthenticated = () => isAuthenticated;

//         // req.user = {};

//         // req.isAuthenticated = function () {
//         //     return true;
//         // };

//         next();
//     }
// });

describe('GET /', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /logout', function() {
  it('responds with 200 status and logout message', function(done) {
    request(app)
      .get('/logout')
    //   .set('Accept', 'application/json')
    //   .expect('Content-Type', /json/)
      .expect(200, done);
  });
});