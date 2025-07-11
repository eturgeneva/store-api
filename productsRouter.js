const express = require('express');
const productsRouter = express.Router();
const { pool } = require('./pool');

// Get all products:
productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        console.log(products);
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
        res.status(200).send(product.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = productsRouter;