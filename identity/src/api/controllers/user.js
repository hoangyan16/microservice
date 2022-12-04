'use trict'
const userService = require('../services/user');
const { ErrorCodes } = require("../constants");
const { responseSuccess, responseWithError } = require("../../utils/messageResponse");
const jwt = require('jsonwebtoken');
const { SubscribeMessage } = require('../../utils/rabbitMQ');
const { validate } = require('../middlewares/validators');
const { User } = require('../../dtos/userRegisterOrLoginRequest');
const { checkAccessToken } = require('../middlewares/jwt_token');

module.exports =async (app, channel)=>{
    const service = new userService();

    // To listen
    SubscribeMessage(channel);

    app.put("/user/:id", checkAccessToken, async (req, res) => {
        try {
            const id = req.params.id;
            const user = req.body;
            await service.update(id, user);
            return true
        } catch (error) {
            res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
        }
    });


    app.post('/user/login', validate.validateRequestData(User), async (req, res) => {
        const user = req.data;
        try {
            const result = await service.login(user);
            res.json(responseSuccess(result));
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
    });


    app.post('/user/register',async(req, res) =>{
        try {
            const user = req.body;
            await service.create(user);
            return user;
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
    });


    app.post('/user/change-password',checkAccessToken,async (req, res) =>{
        try {
            const data = req.body;
            await service.changePassword(data);
            res.json(responseSuccess());
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
    });


    app.post('/user/verify-account',async (req, res) =>{
        const email = req.body.email;
        service.getUserByEmail(email).then(async (user) => {
            if (user) {
                const tokenObject = {
                    email: user.email,
                    id: user.id
                };
                var secret = user.id + '_' + user.email + '_' + new Date();
                var token = jwt.sign(tokenObject, secret);
                var time = new Date();
                var timeExpire = new Date();
                timeExpire.setMinutes(time.getMinutes() + 3);
                const options = {
                    reset_code: token,
                    reset_code_valid: timeExpire
                };
                service.update(user.id, options).then(async (data) => {
                    if (data == 1) {
                        const host = req.headers.host;
                        const checkMailSend = await mailService.sendMailVerify(host, email, token, user.user_name);
                        if (checkMailSend.accepted.length > 0) {
                            res.json(responseSuccess());
                        } else {
                            res.json(responseWithError(ErrorCodes.ERROR_CODE_API_BAD_REQUEST, 'error', messageConstants.USER_SEND_MAIL_FAIL));
                        }
                    } else {
                        res.json(responseWithError(ErrorCodes.ERROR_CODE_API_BAD_REQUEST, 'error', messageConstants.USER_UPDATE_FAIL));
                    }
                });
            } else {
                res.json(responseWithError(ErrorCodes.ERROR_CODE_API_BAD_REQUEST, 'error', messageConstants.USER_MAIL_NOT_EXIST));
            }
        }).catch((err) => {
            res.send({
                error: 1,
                status: err.status || 500,
                message: err.message
            });
        });
    });
    // Forget_password
    app.post('/user/forgot-password',async (req, res, next) =>{
        const request = {
            token: req.body.token,
            password: req.body.password
        }
        service.forgotPassword(request).then((result) => {
            if (result.message) {
                res.json(responseWithError(ErrorCodes.ERROR_CODE_API_BAD_REQUEST, 'error', result.message));
            } else {
                res.json(responseSuccess());
            }
        }).catch((err) => {
            res.send({
                error: 1,
                status: err.status || 500,
                message: err.message
            });
        });
    });
};
