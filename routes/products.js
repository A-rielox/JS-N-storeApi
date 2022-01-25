// '/api/v1/products'
const express = require('express');
const router = express.Router();
const {
   getAllProductsStatic,
   getAllProducts,
} = require('../controllers/products');
// '/api/v1/products'
router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

module.exports = router;
