const express = require('express');
const ordersRouter = express.Router();
const { pool } = require('./pool');

// Place a new order
ordersRouter.post('/', async (req, res, next) => {
    try {
        const newOrder = await pool.query(
            'INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING *',
            [req.user?.id ?? null, 'received']
        )
        if (newOrder.rows.length === 1) {
            res.status(201).send({ order: newOrder.rows[0] });
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