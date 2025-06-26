const { app, pool } = require('../app');
const request = require('supertest');
const assert = require('node:assert');
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
  it('responds with 200 status and logout message', async function() {
    const loginResponse = await request(app)
      .post('/login')
      .send(JSON.stringify({
        login: 'evgesha@mail.com',
        password: '12345'
      }))
      .expect(200)
    
    // console.log(loginResponse);
    const cookie = loginResponse.header['set-cookie'];
    
    await request(app)
      .get('/profile')
      .set('Cookie', cookie)
      .expect(200, 'Login successful')
    await request(app)
      .get('/logout')
      .set('Cookie', cookie)
      .expect(200)
    await request(app)
      .get('/profile')
      .set('Cookie', cookie)
      .expect(401);
  });
});

// User registration
describe('POST /users', function() {
    it('responds with json, creates a new user', async function() {
        const res = await request(app)
            .post('/users')
            .send(JSON.stringify({ 
                username: 'Cat',
                first_name: 'Vasya',
                last_name: 'Pupkin',
                email: 'email@mail.com',
                password: '123'
            }))
            .expect(201)
        console.log(res.body);
        
        assert.ok(!isNaN(res.body.userId));
        // Checking that the user was added to the database
        const userResult = await pool.query(
            'SELECT * FROM customers WHERE id = $1',
            [res.body.userId]
        );
        assert.equal(userResult.rows.length, 1, 'No user was created');

        // Checking that user data has been stored correctly
        const user = userResult.rows[0];
        console.log(user);
        assert.equal(user.id, res.body.userId);
        assert.equal(user.first_name, 'Vasya');
        assert.equal(user.last_name, 'Pupkin');
        assert.equal(user.email, 'email@mail.com');
        assert.equal(user.password, '123');
    })
})