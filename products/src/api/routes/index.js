const express = require("express");
const sendMailRouter = require('./mailRouter');
const uploadRouter = require('./uploadRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const orderRouter = require('./orderRouter');
const cartRouter = require('./cartRouter');
const router = express.Router();

router.use('/send-mail', sendMailRouter,);
router.use('/', uploadRouter);
router.use('/products', productRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);
router.use('/cart', cartRouter);
module.exports = router;
