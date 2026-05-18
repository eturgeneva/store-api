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

// Update a wishlist:
// Each user has only 1 wishlist
wishlistsRouter.put('/', async (req, res, next) => {
    const userId = req.user.id;
    // Check later
    const productId = req.body.productId;
    // const wishlistId = req.wishlistId;
    console.log('product id in wishlist', productId)
    console.log('update wishlist request', req)

    if (!userId) {
        return res.status(400).send('Unable to update a wishlist without user ID');
    } 
    try {
        const foundWishlist = await pool.query(
            `SELECT * FROM wishlists
            WHERE customer_id = $1`,
            [userId]
        )
        console.log('found wishlist', foundWishlist)

        if (foundWishlist) {
            const wishlistId = foundWishlist.rows[0].id;

            const wishlistContent = await pool.query(
                `SELECT * FROM wishlists_products
                WHERE wishlist_id = $1`,
                [wishlistId]
            )
            console.log('already in wishlist', wishlistContent)

            const alreadyInWishlist = wishlistContent.rows.some((item) => item.product_id === productId)
            
            if (!alreadyInWishlist) {
                const wishlistUpdate = await pool.query(
                    `INSERT INTO wishlists_products (product_id, wishlist_id)
                    VALUES ($1, $2)
                    RETURNING *`,
                    [productId, wishlistId]
                )
                if (wishlistUpdate.rows.length !== 1) {
                    res.status(500).send('Failed to update wishlist')
                }
                const joinedWishlistUpdate = await pool.query(
                    `SELECT * FROM wishlists
                    JOIN wishlists_products
                    ON wishlists.id = wishlists_products.wishlist_id
                    JOIN products
                    ON products.id = wishlists_products.product_id
                    WHERE wishlists.customer_id = $1`,
                    [userId]
                )
    
                console.log('joinedWishlistUpdate.rows', joinedWishlistUpdate.rows)
                res.status(200).send({ wishlistUpdate: joinedWishlistUpdate.rows })
            } else {
                return res.status(400).send('Item is already on the wishlist');
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error' + err)
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
            return res.status(404).send('User not found');
        } else {
            const wishlist = await pool.query(
                `SELECT * FROM wishlists
                JOIN wishlists_products
                ON wishlists.id = wishlists_products.wishlist_id
                JOIN products
                ON products.id = wishlists_products.product_id
                WHERE customer_id = $1`,
                [userId]
            );
            res.status(200).send(wishlist.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error' + err);
    }
});

// Delete an item (by ID) from a wishlist (by ID)
wishlistsRouter.delete('/', async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.body.productId;

    if (!userId) {
        return res.status(400).send('No user ID provided');
    }
    if (!productId) {
        return res.status(400).send('No product ID provided');
    }

    try {
        const wishlistExists = await pool.query(
            `SELECT * FROM wishlists
            WHERE customer_id = $1`,
            [userId]
        );
        console.log('wishlistExists', wishlistExists);

        if (!wishlistExists) {
            return res.status(404).send('Wishlist not found')
        }
        const removedProduct = await pool.query(
            `DELETE FROM wishlists_products
            WHERE product_id = $1`,
            [productId]
        );

        if (removedProduct.rowCount !== 1) {
            return res.status(400).send('Failed to remove product from wishlist');
        }
        // Updated wishlist
        const updatedWishlist = await pool.query(
            `SELECT * FROM wishlists
            JOIN wishlists_products
            ON wishlists.id = wishlists_products.wishlist_id
            JOIN products
            ON products.id = wishlists_products.product_id
            WHERE customer_id = $1`,
            [userId]
        );
        console.log('updated wishlist', updatedWishlist);
        res.status(200).send({ updatedWishlist: updatedWishlist.rows });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error' + err);
    }
})


module.exports = wishlistsRouter;