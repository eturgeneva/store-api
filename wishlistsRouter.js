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
            // Valid user ID, but the user already has a wishlist
            const checkUserWishlist = await pool.query(
                `SELECT id FROM wishlists
                WHERE customer_id = $1`,
                [userId]
            );
            if (checkUserWishlist.rows.length === 1) {
                // return res.status(400).send('The user already has a wishlist');
                return res.status(200).send({ wishlistId: checkUserWishlist.rows[0].id });
            }
            
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
        console.error(err);
        res.status(500).send('Internal Server Error' + err);
    }
});

// Get a user wishlist
wishlistsRouter.get('/', async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).send('No user ID provided');
    }
    try {
        const checkUserId = await pool.query(
            `SELECT * FROM customers
            WHERE id = $1`,
            [userId]
        );
        if (checkUserId.rows.length !== 1) {
            return res.status(404).send('No user found');
        } else {
            const wishlist = await pool.query(
                `SELECT * FROM wishlists
                JOIN wishlists_products
                ON wishlists.id = wishlists_products.wishlist_id
                WHERE customer_id = $1`,
                [userId]
            );
            res.status(200).send(wishlist.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error' + err);
    }
})


module.exports = wishlistsRouter;