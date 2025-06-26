const { app } = require('../server');
const request = require('supertest');
// const { it, describe } = require('node:test');
// console.log(app);

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

// request(app)
//   .get('/')
//   .expect('Content-Type', /json/)
//   .expect('Content-Length', '15')
//   .expect(200)
//   .end(function(err, res) {
//     if (err) throw err;
//   });

describe('GET /', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});