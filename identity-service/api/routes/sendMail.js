const express = require('express');
const router = express.Router();
const mailController = require("../controllers/mail");

router.post("/common", mailController.sendMail);

module.exports = router;