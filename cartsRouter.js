const express = require('express');
const { format, addMonths } = require('date-fns');
const cartsRouter = express.Router();
const { pool } = require('./pool');

const expirationTimeMonth = 3;

// Create a new cart:
cartsRouter.post('/', async (req, res, next) => {

    // const cartExpirationDate = Math.floor(Date.now()/1000);
    const cartExpirationDate = addMonths(new Date(), expirationTimeMonth);
    console.log('cart expiration date', cartExpirationDate);
    console.log('authorized user', req.user.id);
    try {
        const newCart = await pool.query(
            'INSERT INTO carts (customer_id, expires_at) VALUES ($1, $2) RETURNING id', 
            // [req.user.id]
            [null, format(cartExpirationDate, 'yyyy-MM-dd HH:mm:ss')]
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