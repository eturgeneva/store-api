const express = require('express');
const { format, addMonths } = require('date-fns');
const cartsRouter = express.Router();
const { pool } = require('./pool');

const expirationTimeMonth = 3;

// Create a new cart
cartsRouter.post('/', async (req, res, next) => {
    console.log('Req session', req.session);
    if (req.session.cartId) {
        res.status(200).send({ cartId: req.session.cartId });
        return;
    }

    const cartExpirationDate = addMonths(new Date(), expirationTimeMonth);
    console.log('cart expiration date', cartExpirationDate);

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

// Update cart
cartsRouter.put('/me', async (req, res, next) => {
    const productId = req.body.productId;
    
    try {
        // Check quantity
        const dbQuantity = await pool.query(
            'SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2',
            [req.body.cartId, productId]
        );
        if (dbQuantity.rows.length === 1) {
            // await pool.query(
            //     'UPDATE carts_products SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
            //     [dbQuantity.rows[0].quantity + 1, productId, req.body.cartId]
            // );
            if (req.body.quantity < 0) {
                res.status(400).send('Failed to update cart, number of items is too low');
            }

            await pool.query(
                'UPDATE carts_products SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
                [req.body.quantity, productId, req.body.cartId]
            );
            const joinedCartUpdate = await pool.query(
                'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1',
                [req.body.cartId]
            );
            res.status(200).send({ products: joinedCartUpdate.rows });
            
        } else {
            const updateCart = await pool.query(
                'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [req.body.cartId, productId, req.body.quantity]
            )
            if (updateCart.rows.length === 1) {
                const joinedCartUpdate = await pool.query(
                    'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1',
                    [req.body.cartId]
                );
                res.status(200).send({ products: joinedCartUpdate.rows });
            } else {
                res.status(400).send('Failed to update cart');
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

// Get cart by ID
cartsRouter.get('/:cartId', async (req, res, next) => {
    const cartId = req.params.cartId;
    try {
        const cart = await pool.query(
            'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1',
            [cartId]
        );
        res.status(200).send({ products: cart.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = cartsRouter;