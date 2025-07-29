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

    // If we need to set a specific quantity:
    // if (req.body.setQuantity) {
        try {
            // Check product quantity in the cart
            const dbQuantity = await pool.query(
                'SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2',
                [req.body.cartId, productId]
            );
            // If a specific product is already in the cart
            if (dbQuantity.rows.length === 1) {

                // quantityUpdate property
                if (req.body.quantityUpdate) {
                    let newQuantity = dbQuantity.rows[0].quantity + req.body.quantityUpdate;
                    if (newQuantity < 0) {
                        return res.status(400).send('Failed to update cart');
                    }

                    if (newQuantity === 0) {
                        const deleteUpdate = await pool.query(
                            'DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2',
                            [req.body.cartId, productId]
                        );
                        console.log('delete update', deleteUpdate);

                        if (deleteUpdate.rowCount !== 1) {
                            return res.status(400).send('Unexpected error when removing product from cart');
                        }
                    } else {
                        const quantityUpdate = await pool.query(
                            'UPDATE carts_products SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
                            [newQuantity, productId, req.body.cartId]
                        );
                        if (quantityUpdate.rowCount !== 1) {
                            return res.status(400).send('Failed to update cart');
                        }
                        const joinedCartUpdate = await pool.query(
                            'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1 ORDER BY product_id',
                            [req.body.cartId]
                        );
                        return res.status(200).send({ products: joinedCartUpdate.rows });
                    }
                }

                // setQuantity property
                // If we're supposed to remove the product from the cart entirely
                if (req.body.setQuantity === 0) {
                    const deleteUpdate = await pool.query(
                        'DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2',
                        [req.body.cartId, productId]
                    );
                    console.log('delete update', deleteUpdate);

                    if (deleteUpdate.rowCount !== 1) {
                        return res.status(400).send('Unexpected error when removing product from cart');
                    }
                // If we're not supposed to delete the product
                } else {
                    const quantityUpdate = await pool.query(
                        'UPDATE carts_products SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
                        [req.body.setQuantity, productId, req.body.cartId]
                    );
                    if (quantityUpdate.rowCount !== 1) {
                        return res.status(400).send('Failed to update cart');
                    }
                }
                // Sending updated cart
                const joinedCartUpdate = await pool.query(
                    'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1 ORDER BY product_id',
                    [req.body.cartId]
                );
                return res.status(200).send({ products: joinedCartUpdate.rows });

            // If a specific product is NOT in the cart yet
            } else {
                if ((req.body.quantityUpdate && req.body.quantityUpdate > 0) || (req.body.setQuantity && req.body.setQuantity > 0)) {
                    const updateCart = await pool.query(
                        'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                        [req.body.cartId, productId, req.body.quantityUpdate || req.body.setQuantity]
                    )
                    if (updateCart.rows.length !== 1) {
                        return res.status(400).send('Failed to update cart');
                    }
                    const joinedCartUpdate = await pool.query(
                        'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1 ORDER BY product_id',
                        [req.body.cartId]
                    );
                    return res.status(200).send({ products: joinedCartUpdate.rows });
                }
            }

        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    // }
})

// cartsRouter.put('/me', async (req, res, next) => {
//     const productId = req.body.productId;
    
//     if (req.body.quantity < 0) {
//         return res.status(400).send('Failed to update cart, number of items is too low');
//     }

//     try {
//         // Check quantity
//         const dbQuantity = await pool.query(
//             'SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2',
//             [req.body.cartId, productId]
//         );
//         if (dbQuantity.rows.length === 1) {
     
//             if (req.body.quantity === 0) {
//                 const deleteUpdate = await pool.query(
//                     'DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2',
//                     [req.body.cartId, productId]
//                 );
//                 console.log('delete update', deleteUpdate);
//                 if (deleteUpdate.rowCount !== 1) {
//                     return res.status(400).send('Unexpected error when removing product from cart');
//                 }

//             } else {
//                 const quantityUpdate = await pool.query(
//                     'UPDATE carts_products SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
//                     [req.body.quantity, productId, req.body.cartId]
//                 );
//                 if (quantityUpdate.rowCount !== 1) {
//                     return res.status(400).send('Failed to update cart');
//                 }
//             }

//         } else {
//             const updateCart = await pool.query(
//                 'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
//                 [req.body.cartId, productId, req.body.quantity]
//             )
//             if (updateCart.rows.length !== 1) {
//                 return res.status(400).send('Failed to update cart');
//             }
//         }
//         const joinedCartUpdate = await pool.query(
//             'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1 ORDER BY product_id',
//             [req.body.cartId]
//         );
//         res.status(200).send({ products: joinedCartUpdate.rows });

//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// })

// Get cart by ID
cartsRouter.get('/:cartId', async (req, res, next) => {
    const cartId = req.params.cartId;
    try {
        const cart = await pool.query(
            'SELECT * FROM carts_products JOIN products ON carts_products.product_id = products.id WHERE carts_products.cart_id = $1 ORDER BY product_id',
            [cartId]
        );
        res.status(200).send({ products: cart.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = cartsRouter;