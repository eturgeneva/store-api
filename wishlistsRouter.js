const express = require('express');
const wishlistsRouter = express.Router();
const { pool } = require('./pool');

// Create a wishlist
wishlistsRouter.post('/', async (req, res, next) => {
    const userId = req.user.id;
    // No user ID provided
    if (!userId) {
        return res.status(400).send('Unable to create wishlist without user ID');
    }
    
    try {
        // Invalid user ID
        const checkUserId = await pool.query(
            `SELECT id FROM customers
            WHERE id = $1`,
            [userId]
        );
        if (checkUserId.rows.length !== 1) {
            return res.status(400).send('Unable to create wishlist, user does not exist');

        } else {
            const newWishlist = await pool.query(
                `INSERT INTO wishlists (customer_id)
                VALUES ($1)
                RETURNING *`,
                [userId]
            );
            if (newWishlist.rows.length !== 1) {
                return res.status(500).send('Failed to create a wishlist');
            }

            res.status(201).send({ wishlistId: newWishlist.rows[0].id });
        }

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Get a user wishlist



module.exports = wishlistsRouter;