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
    try {
        const products = await pool.query('SELECT * FROM products');
        console.log(products);
        // res.status(200).send({ products: products.rows });
        res.status(200).send(products.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

productsRouter.get('/:id', async (req, res, next) => {
    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (product.rows.length === 0) {
            res.status(404).send('Product not found')
        }
        // res.status(200).send(product);
        res.status(200).send(product.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = productsRouter;