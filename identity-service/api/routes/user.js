const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const { validate } = require('./../middlewares/validators');
const {checkAccessToken}= require('../middlewares/jwt_token');
const {User} = require('../../dtos/userRegisterOrLoginRequest');

router.put("/:id",checkAccessToken, userController.update);
router.post('/register',userController.register);
router.post('/login',validate.validateRequestData(User),userController.login);
router.post('/change-password',checkAccessToken,userController.changePassword);
router.post('/verify-account', userController.sendMailVerify);
router.post('/forgot-password', userController.forgotPassword);


module.exports = router;
