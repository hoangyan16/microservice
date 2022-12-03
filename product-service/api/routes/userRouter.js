const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { validate } = require('../middlewares/validators');
const {checkAccessToken}= require('../middlewares/jwt_token');
const {User} = require('../../dtos/userRegisterOrLoginRequestDto');


router.put("/:id",checkAccessToken, userController.update);
router.post('/register',userController.register);
router.post('/change-password',checkAccessToken,userController.changePassword);
router.post('/verify-account', userController.sendMailVerify);
router.post('/forgot-password', userController.forgotPassword);


module.exports = router;
