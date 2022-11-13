'use trict'
const userService = require('../services/userService');
const mailService = require('../services/mailService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseSuccess, responseWithError } = require("../utils/messageResponse");
const jwt = require('jsonwebtoken')
const {EVENTSTATUS} = require("../constants/Enum");
const {CreateChannel} = require('../utils/rabbitMQ');

exports.update = async (req, res) => {
    const user = req.data;
    const { id } = req.params;
    try {
        await userService.update(id, user);
        res.json(responseSuccess());
    } catch (error) {
        res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
    }
};


exports.login = async (req, res) => {
    const user = req.data;
    try {
        const result = await userService.login(user);
        res.json(responseSuccess(result));
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.register = async (req, res) => {
    try {
        const channel =await CreateChannel();
        const user = req.body;
        const payload = {
            event: EVENTSTATUS.CREATE.value,
            data: user
        }
        await userService.create(user);
        channel.sendToQueue("IDENTITY",Buffer.from(JSON.stringify(payload)));
        await channel.close();
        res.json(responseSuccess())
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.changePassword = async (req, res) => {
    try {
        const userRequest = req.body;
        userRequest.userId = req.user.id;
        await userService.changePassword(userRequest);
        res.json(responseSuccess());
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.sendMailVerify = async (req, res) => {
    const email = req.body.email;
    userService.getUserByEmail(email).then(async (user) => {
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
            userService.update(user.id, options).then(async (data) => {
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
};
// Forget_password
exports.forgotPassword = async (req, res, next) => {
    const request = {
        token: req.body.token,
        password: req.body.password
    }
    userService.forgotPassword(request).then((result) => {
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
};
