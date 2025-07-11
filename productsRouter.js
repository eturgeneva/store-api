const express = require('express');
const { Pool } = require('pg');
const productsRouter = express.Router();
// const { pool } = require('./app');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional:
  // ssl: { rejectUnauthorized: false } // for Heroku or secured environments
});

// Get all products:
productsRouter.get('/', async (req, res, next) => {
    // res.send({ products: 'Product 1'});

    const products = await pool.query('SELECT * FROM products');
    console.log(products);
    // res.status(200).send({ products: products.rows });
    res.status(200).send(products.rows);
});

productsRouter.get('/:id', async (req, res, next) => {
    
})

module.exports = productsRouter;