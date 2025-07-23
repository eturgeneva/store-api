const { app, pool } = require('../app');
const request = require('supertest');
const assert = require('node:assert');
const bcrypt = require('bcrypt');

let user = {};
let isAuthenticated = true;

// Tests are outdated!!!

describe('GET /', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// Login
describe('POST /login', () => {
  it('responds with json and 200 status, log a user in', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'evgesha@mail.com',
        password: '12345'
      })
      .expect(200)
    const cookie = loginResponse.header['set-cookie'];
    
    // Checking that the user has access to profile
    await request(app)
      .get('/profile')
      .set('Cookie', cookie)
      .expect(200, 'Login successful')
  })
})

// Logout 
describe('POST /logout', () => {
  it('responds with 200 status and logout message', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'evgesha@mail.com',
        password: '12345'
      })
      .expect(200)
    // console.log(loginResponse);
    const cookie = loginResponse.header['set-cookie'];
    
    await request(app)
      .get('/profile')
      .set('Cookie', cookie)
      .expect(200, 'Login successful')

    await request(app)
      .post('/logout')
      .set('Cookie', cookie)
      .expect(200)

    // Checking that the user doesn't have access to profile anymore
    await request(app)
      .get('/profile')
      .set('Cookie', cookie)
      .expect(401);
  });
});

// User registration
describe('POST /users', () => {
    it('responds with json, creates a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({ 
                username: 'TestUser',
                first_name: 'Test',
                last_name: 'User',
                email: 'user@test.com',
                password: '123'
            })
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
        assert.equal(user.first_name, 'Test');
        assert.equal(user.last_name, 'User');
        assert.equal(user.email, 'user@test.com');
        assert.ok(bcrypt.compare('123', user.password));
    })
})