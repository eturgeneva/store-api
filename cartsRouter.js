const express = require('express');
const { format, addMonths } = require('date-fns');
const cartsRouter = express.Router();
const { pool } = require('./pool');

const expirationTimeMonth = 3;

// Create a new cart:
cartsRouter.post('/', async (req, res, next) => {
    console.log('Req session', req.session);
    if (req.session.cartId) {
        res.status(200).send({ cartId: req.session.cartId });
        return;
    }

    const cartExpirationDate = addMonths(new Date(), expirationTimeMonth);
    console.log('cart expiration date', cartExpirationDate);
    // console.log('authorized user', req.user.id);

    try {
        const newCart = await pool.query(
            'INSERT INTO carts (customer_id, expires_at) VALUES ($1, $2) RETURNING id', 
            [req.user?.id ?? null, format(cartExpirationDate, 'yyyy-MM-dd HH:mm:ss')]
        )
        if (newCart.rows.length === 1) {
            req.session.cartId = newCart.rows[0].id;
            res.status(201).send({ cartId: newCart.rows[0].id });
        } else {
            res.status(400).send('Failed to create a new cart');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Get cart by ID:
cartsRouter.get('/:cartId', async (req, res, next) => {
    const cartId = req.params.cartId;
    try {
        const cart = await pool.query('SELECT * FROM carts WHERE id = $1', [cartId]);
        if (cart.rows.length === 0) {
            res.status(404).send('Cart not found');
        }
        console.log('Get card by ID response', cart.rows[0]);
        res.status(200).send(cart.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

})

module.exports = cartsRouter;