const express = require('express');
const ordersRouter = express.Router();
const { pool } = require('./pool');

// Place a new order
ordersRouter.post('/', async (req, res, next) => {
    const { products } = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send('Products must be a non-empty array');
    }

    console.log('Products from request body', products);
    console.log('Req session cart ID', req.session.cartId);
    
    try {
        const newOrder = await pool.query(
            `INSERT INTO orders (customer_id, status) 
            VALUES ($1, $2) 
            RETURNING *`,
            [req.user?.id ?? null, 'received']
        )
        if (newOrder.rows.length === 1) {
            // Adding order info into the database:
            try {
                await Promise.all(
                    products.map(product => {
                        return pool.query(
                            `INSERT INTO orders_products (product_id, order_id, quantity, price_cents) 
                            VALUES ($1, $2, $3, $4) 
                            RETURNING *`,
                            [product.product_id, newOrder.rows[0].id, product.quantity, product.price_cents]
                        )
                    })
                );
            } catch (err) {
                console.error(err);
                return res.status(500).send('Failed to add products to order');
            }
    
            // Combined result from orders and orders_products
            const orderDetails = await pool.query(
                `SELECT * FROM orders 
                JOIN orders_products 
                    ON orders.id = orders_products.order_id 
                WHERE orders.id = $1`,
                [newOrder.rows[0].id]
            );
            console.log('Placed order details', orderDetails.rows);

            // Resetting session cart ID after checkout
            req.session.cartId = null;
            console.log('Req session cart ID', req.session.cartId);

            res.status(201).send({ order: orderDetails.rows });

        } else {
            res.status(400).send('Failed to place an order')
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Get all orders placed by a user
ordersRouter.get('/users/:userId', async (req, res, next) => {
    const userId = req.user.id;
    console.log('Request user ID', userId);

    if (!userId) {
        return res.status(404).send('No order history found');
    }

    try {
        const ordersByUserId = await pool.query(
            `SELECT orders.id, 
                    orders.status, 
                    SUM(orders_products.quantity) AS product_count, 
                    SUM(orders_products.price_cents * orders_products.quantity) AS total_price 
            FROM orders 
            JOIN orders_products 
                ON orders.id = orders_products.order_id 
            WHERE customer_id = $1 
            GROUP BY orders.id`,
            [userId]
        );
        res.status(200).send({ orders: ordersByUserId.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

});

// Get an order by ID
ordersRouter.get('/:orderId', async (req, res, next) => {
    // const orderId = req.body.orderId;
    const orderId = req.params.orderId;
    console.log('Req params orderId', orderId);

    if (orderId <= 0) {
        return res.status(400).send('Invalid order id');
    }
    
    try {
        const checkOrderId = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [orderId]
        )
        // Order ID not found
        if (checkOrderId.rows.length !== 1) {
            return res.status(404).send('No order with this ID found');
        } else {
            // Order ID found
            const orderItems = await pool.query(
                `SELECT orders.customer_id, 
                        products.id AS product_id, 
                        products.name, 
                        products.brand, 
                        products.price_cents, 
                        orders_products.quantity 
                FROM orders 
                JOIN orders_products 
                    ON orders.id = orders_products.order_id 
                JOIN products 
                    ON orders_products.product_id = products.id 
                WHERE orders.id = $1`,
                [orderId]
            );
            console.log(orderItems);
            const orderDetails = await pool.query(
                `SELECT orders.placed_at,
                        orders.status AS order_status,
                        SUM(orders_products.price_cents * orders_products.quantity) AS total_price
                FROM orders 
                JOIN orders_products
                    ON orders.id = orders_products.order_id 
                WHERE orders.id = $1
                GROUP BY orders.id`,
                [orderId]
            );

            if (orderItems.rows.length === 0 || orderDetails.rows.length === 0) {
                return res.status(400).send('Failed to receive order details');
            }
            res.status(200).send({ 
                orderId: orderId,
                items: orderItems.rows,
                priceTotal: orderDetails.rows[0].total_price,
                status:  orderDetails.rows[0].order_status,
                placedAt: orderDetails.rows[0].placed_at,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Cancel an order by ID
ordersRouter.delete('/:orderId', async (req, res, next) => {
    const orderId = req.body.orderId;

    if (orderId <= 0) {
        return res.status(400).send('Invalid order id');
    }
    try {
        // Check if order exists
        const checkOrderId = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [orderId]
        )
        // Order ID not found
        if (checkOrderId.rows.length !== 1) {
            return res.status(404).send('No order with this ID found');

        // The order is found, but is already cancelled
        } else if (checkOrderId.rows[0].status === 'cancelled') {
            return res.status(400).send('The order is already cancelled');

        } else {
            const orderStatusUpdate = await pool.query(
                'UPDATE orders SET status = $1 WHERE id = $2',
                ['cancelled', orderId]
            );
            if (orderStatusUpdate.rowCount !== 1) {
                return res.status(400).send('Failed to update order');
            }
            res.status(200).send('The order has been cancelled');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }


})

module.exports = ordersRouter;