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

// Get cart of the currently logged in user:
cartsRouter.get('/me', async (req, res, next) => {
    // console.log('Req session', req.session);
    // const userId = req.user.id;

    // try {
    //     const cart = await pool.query('SELECT * FROM carts WHERE customer_id = $1 ORDER BY id DESC', [4]);
    //     if (cart.rows.length === 0) {
    //         res.status(404).send('Cart not found');
    //     }
    //     console.log('Get card by ID response', cart.rows[0]);
    //     res.status(200).send(cart.rows[0]);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Internal Server Error');
    // }
});

// Update cart:
cartsRouter.put('/me', async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const updateCart = await pool.query(
            'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [req.body.cartId, productId, req.body.quantity]
        )
        if (updateCart.rows.length === 1) {
            // res.status(201).send(updatedCart.rows[0]);

            // Works, but sends data only from carts_products table:
            // const cartUpdate = await pool.query(
            //     'SELECT * FROM carts_products WHERE cart_id = $1',
            //     [req.body.cartId]
            // );

            const joinedCartUpdate = await pool.query(
                'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1',
                [req.body.cartId]
            );
            
            res.status(200).send(joinedCartUpdate.rows);
        } else {
            res.status(400).send('Failed to update cart');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

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
});


module.exports = cartsRouter;