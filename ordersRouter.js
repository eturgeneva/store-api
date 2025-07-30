const express = require('express');
const ordersRouter = express.Router();
const { pool } = require('./pool');

// Place a new order
ordersRouter.post('/', async (req, res, next) => {
    const { products } = req.body;
    console.log('Products from request body', products);
    
    try {
        const newOrder = await pool.query(
            'INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING *',
            [req.user?.id ?? null, 'received']
        )
        if (newOrder.rows.length === 1) {
            // res.status(201).send({ order: newOrder.rows[0] });

            // Adding order info into the database:
            products.forEach(async (product) => {
                const newOrderDetails = await pool.query(
                    'INSERT INTO orders_products (product_id, order_id, quantity, price_cents) VALUES ($1, $2, $3, $4) RETURNING *',
                    [product.product_id, newOrder.rows[0].id, product.quantity, product.price_cents]
                );
                if (newOrderDetails.rows.length !== 1) {
                    return res.status(400).send('Failed to store order data');
                }
            });
    
            // Combined result from orders and orders_products
            const orderDetails = await pool.query(
                'SELECT * FROM orders JOIN orders_products ON orders.id = orders_products.order_id WHERE orders.id = $1',
                [newOrder.rows[0].id]
            );

            res.status(201).send({ order: orderDetails.rows });

        } else {
            res.status(400).send('Failed to place an order')
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }


});

// Get an order by ID


module.exports = ordersRouter;