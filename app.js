require("dotenv").config();
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');
const { Pool } = require('pg');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');

const app = express();
// const PORT = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional:
  // ssl: { rejectUnauthorized: false } // for Heroku or secured environments
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport needs the session middleware to be initialized first, otherwise req.isAuthenticated() and req.user won’t work properly across requests.
// Session middleware:
app.use(	
  session({	
    secret: 'mySecret',	
    resave: false,	
    saveUninitialized: false	
  })	
);	
// THEN initialize Passport	
app.use(passport.initialize());	
app.use(passport.session());	

app.use(logReqestStatus);

// Postgres Setup

// Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async function(email, password, done) {
    console.log('local');
    try {
      const userResult = await pool.query(
        'SELECT * FROM customers WHERE email = $1',
        [email]
      );
      // If user not found
      if (userResult.rows.length === 0) {
        return done(null, false, { message:'Incorrect email or password' });
      }
      // If password is incorrect
      const storedPassword = userResult.rows[0].password;
      if (password !== storedPassword) return done(null, false, { message:'Incorrect email or password' });
      
      return done(null, userResult.rows[0]); // to return the actual user
    } catch (err) {
      return done(err);
    }
  }
))

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    // callbackURL: 'http://localhost:3000',
    callbackURL: 'http://localhost:3000/oauth2/redirect/google',
    scope: [ 'profile', 'email' ],
    state: true
  },
  async function verify(accessToken, refreshToken, profile, cb) {
    try {
      console.log("Google profile:", profile);
      // Check if federated credential exists
      const credResult = await pool.query(
        'SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2',
        ['https://accounts.google.com', profile.id]
      );

      // New user insert
      if (credResult.rows.length === 0) {
        const newUser = await pool.query(
          'INSERT INTO customers (username, first_name, last_name, email) VALUES ($1, $2, $3, $4) RETURNING id, username',
          [profile.displayName, profile.name.givenName, profile.name.familyName, profile.emails[0].value]
        );
        const user = newUser.rows[0];

        await pool.query(
          'INSERT INTO federated_credentials (customer_id, provider, subject) VALUES ($1, $2, $3)',
          [user.id, 'https://accounts.google.com', profile.id]
        );

        return cb(null, user);
      } else {
        // Existing user: fetch from users
        const user_id = credResult.rows[0].customer_id;
        const userResult = await pool.query(
          'SELECT id, username FROM customers WHERE id = $1',
          [user_id]
        );
        // User not found
        if (userResult.rows.length === 0) return cb(null, false);
        return cb(null, userResult.rows[0]);
      }
    } catch (err) {
      console.error('Error in verify function', err);
      return cb(err);
    }
  }
));

// Serialize and deserialize
passport.serializeUser((user, done) => {
  console.log('serialize', user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserialize');
  try {
    const result = await pool.query('SELECT id, username FROM customers WHERE id = $1', [id]);
    console.log('deserialize result', result);
    if (result.rows.length === 0) return done(null, false);
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
});

app.get('/', (req, res) => {
  res.json({ description: 'e-commerce REST API using Express, Node.js, and Postgres' });
});

app.post('/login', passport.authenticate('local'), (req, res, next) => {
  // return res.status(200).send({ message: 'Login successful' });
  return res.status(200).send({
    message: 'Login successful',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name
    }
  });
});

// For Google OAuth 2.0
// redirects the user to the Google, where they will authenticate:
app.get('/login/google', passport.authenticate('google'));

// processes the authentication response and logs the user in, after Google redirects the user back to the app:
app.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login/google', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
});

// User registration
app.post('/users', async (req, res, next) => {
  // For test
  // console.log({ userId: res.id });
  // res.status(201).send({ userId: 1 });

  const { username, first_name, last_name, email, password } = req.body;
  try {
      const newUser = await pool.query(
        'INSERT INTO customers (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [username, first_name, last_name, email, password]
      )
      if (newUser.rows.length === 1) {
        res.status(201).send({ userId: newUser.rows[0].id });
      } else {
        res.status(400).send('Registration failed');
      }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error')
  }
});

app.get('/profile', checkIfAuthenticated, (req, res, next) => {
    res.status(200).send('Login successful');
});


app.all('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.status(200).send('Successful logout');
  });
});

// app.listen(PORT, () => {
//     console.log(`App running on http://localhost:${PORT}`);
// })

function logReqestStatus(req, res, next) {
    if (req) {
        console.log('Request status', req.isAuthenticated());
    }
    next();
}

function checkIfAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    if (req && req.isAuthenticated()) {
        next();
    } else {
        console.log('Please login');
        // res.redirect('/login');
        res.status(401).send();
    }
}

module.exports = { app, pool };