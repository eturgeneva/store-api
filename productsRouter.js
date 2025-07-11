const express = require('express');
const productsRouter = express.Router();

// Get all products:
productsRouter.get('/', (req, res, next) => {
    res.send({ products: 'Product 1'});
})

module.exports = productsRouter;