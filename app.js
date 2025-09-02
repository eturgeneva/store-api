require("dotenv").config();
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');
const { pool } = require('./pool');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require('bcrypt');

//  /c/Users/Elena/ngrok http --domain aardvark-cool-weasel.ngrok-free.app 3000

const app = express();

app.use(cors({
  // origin: 'http://localhost:5173',
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport needs the session middleware to be initialized first, otherwise req.isAuthenticated() and req.user won’t work properly across requests.
// Session middleware:
app.use(	
  session({	
    secret: process.env.SESSION_SECRET,
    resave: false,	
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Change to true in production with HTTPS
      sameSite: 'lax' // or 'none' if frontend and backend are on different origins
  }	
  })	
);	

app.use(passport.initialize());	
app.use(passport.session());	

app.use(logReqestStatus);

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
      const storedPasswordHash = userResult.rows[0].password;
      const passwordMatch = await comparePasswords(password, storedPasswordHash);
      if (!passwordMatch) {
        return done(null, false, { message:'Incorrect email or password' });
      }
      
      return done(null, userResult.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
))

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
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
    const result = await pool.query('SELECT id, username, first_name, last_name, address FROM customers WHERE id = $1', [id]);
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

// User login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error', err);
      return res.status(500).send({ message: 'Internal server Error' });
    }

    if (!user) {
      console.log('Login info', info);
      return res.status(401).send({ message: info?.message || 'Invalid credentials' });
    }

    const cartId = req.session.cartId;
    req.login(user, (err) => {
      if (err) {
        console.error('Login error', err);
        return res.status(500).send({ message: 'Login failed' });
      }
      if (cartId) {
        req.session.cartId = cartId;
        pool.query('UPDATE carts SET customer_id = $1 WHERE id = $2', [user.id, cartId]);
      }
      return res.status(200).send('Login successful');
    })

  })(req, res, next);
});

// User login Google OAuth 2.0
// redirects the user to the Google, where they will authenticate
app.get('/login/google', passport.authenticate('google'));

// processes the authentication response and logs the user in, after Google redirects the user back to the app
app.get('/oauth2/redirect/google',
  (req, res, next) => {
    req.cartId = req.session.cartId;
    next();
  },
  passport.authenticate('google', { failureRedirect: '/login/google', failureMessage: true }),
  function(req, res) {
    if (req.cartId) {
      req.session.cartId = req.cartId;
      pool.query('UPDATE carts SET customer_id = $1 WHERE id = $2', [req.user.id, req.cartId]);
    }
    res.redirect('http://localhost:5173/profile');
    // res.redirect('http://localhost:5174/profile');
});

// User registration
app.post('/users', async (req, res, next) => {
  const { username, first_name, last_name, email, password } = req.body;

  const saltRounds = 15;
  const hashedPassword = await passwordHash(password, saltRounds);

  try {
      const newUser = await pool.query(
        'INSERT INTO customers (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [username, first_name, last_name, email, hashedPassword]
      )
      if (newUser.rows.length === 1) {
        res.status(201).send({ userId: newUser.rows[0].id });
      } else {
        res.status(400).send('Registration failed');
      }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/me', (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.status(200).send({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        address: req.user.address,
        cartId: req.session.cartId
      });
    }
    res.status(200).send({ 
      id: null, 
      username: 'guest', 
      email: '', 
      first_name: 'guest',
      last_name: '',
      address: '',
      cartId: req.session.cartId
    })
});

// User update info
app.put('/users/:id', async (req, res, next) => {
  const { first_name, last_name, address } = req.body;
  const userId = req.params.id;
  try {
      const updatedUser = await pool.query(
      'UPDATE customers SET first_name = $1, last_name = $2, address = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, address, userId]
    )
    if (updatedUser.rows.length === 1) {
          res.status(201).send({ userId: updatedUser.rows[0] });
    } else {
          res.status(400).send('Failed to update user information');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

// User logout
app.all('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.status(200).send('Successful logout');
  });
});

// Products
const productsRouter = require('./productsRouter.js');
app.use('/products', productsRouter);

// Cart
const cartsRouter = require('./cartsRouter.js');
app.use('/carts', cartsRouter);

// Orders
const ordersRouter = require('./ordersRouter.js');
app.use('/orders', ordersRouter);

// Wishlists
const wishlistsRouter = require('./wishlistsRouter.js');
app.use('/wishlists', checkIfAuthenticated, wishlistsRouter);


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
        res.status(401).send();
    }
}

async function passwordHash(password, saltRounds) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error('Hashing falied', err);
    throw new Error('Failed to hash password');
  }
}

async function comparePasswords(password, hash) {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.error(err);
    throw new Error('Passwords don\'t match');
  }
}

module.exports = { app, pool };