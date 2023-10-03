// Basic Lib Imports
const express = require('express');

const router = express.Router();


const bookRouters = require('./bookRouters');
const userRouters = require('./userRouters');
const cartRouters = require('./cartRouters');
const analyticsRouters = require('./analyticsRouters');
const wishlistRouters = require('./wishlistRouters');
const orderRouters = require('./orderRouters');
const reviewRouters = require('./reviewRouters');


router.use('/users', userRouters);
router.use('/books', bookRouters);
router.use('/cart', cartRouters);
router.use('/wishlist', wishlistRouters);
router.use('/analytics', analyticsRouters);
router.use('/order', orderRouters);
router.use('/reviews', reviewRouters);


module.exports =  router;