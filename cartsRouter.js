const express = require('express');
const cartsRouter = express.Router();
const { pool } = require('./pool');

// Create a new cart:
cartsRouter.post('/', async (req, res, next) => {
    try {
        const newCart = await pool.query(
            'INSERT INTO carts (customer_id) VALUES ($1) RETURNING id', 
            // [req.user.id]
            [null]
        )
        if (newCart.rows.length === 1) {
            res.status(201).send({ cartId: newCart.rows[0].id });
        } else {
            res.status(400).send('Failed to create a new cart');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = cartsRouter;