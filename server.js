require("dotenv").config();
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const { Pool } = require('pg');
const GoogleStrategy = require('passport-google-oauth20');

const app = express();
const PORT = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional:
  // ssl: { rejectUnauthorized: false } // for Heroku or secured environments
});
// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'api',
//   password: 'password',
//   port: 5432,
// });

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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

// SQLite Setup

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3000',
    scope: [ 'profile' ],
    state: true
  },
  function verify(accessToken, refreshToken, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      'https://accounts.google.com',
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      
      if (!cred) {
        // The account at Google has not logged in to this app before.  Create a
        // new user record and associate it with the Google account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
          
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            'https://accounts.google.com',
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The account at Google has previously logged in to the app.  Get the
        // user record associated with the Google account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    });
  }
));

// Serialize and deserialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });
passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], function(err, user) {
    done(err, user);
  });
});

app.get('/', (req, res) => {
    res.json({ description: 'e-commerce REST API using Express, Node.js, and Postgres' });
});

// For Google OAuth 2.0
// redirects the user to the Google, where they will authenticate:
app.get('/login/google', passport.authenticate('google'));

// processes the authentication response and logs the user in, after Google redirects the user back to the app:
app.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
});

app.get('/profile', checkIfAuthenticated, (req, res, next) => {
    res.status(200).send('Login successful');
})

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})

function logReqestStatus(req, res, next) {
    if (req) {
        console.log('Request status', req.isAuthenticated());
        next();
    }
    next();
}

function checkIfAuthenticated(req, res, next) {
    if (req && req.isAuthenticated()) {
        next();
    } else {
        console.log('Please login');
        res.redirect('/login');
    }
}