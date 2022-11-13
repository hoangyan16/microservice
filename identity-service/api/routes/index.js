const express = require("express");
const sendMailRouter = require('./sendMail');
const userRouter = require('./user');
const uploadRouter = require('./upload');

const router = express.Router();

router.use('/send-mail', sendMailRouter);
router.use('/', uploadRouter);
router.use('/user', userRouter)

module.exports = router;
