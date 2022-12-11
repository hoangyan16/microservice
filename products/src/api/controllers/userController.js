'use trict'
const userService = require('../services/userService');
const mailService = require('../services/mailService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseSuccess, responseWithError } = require("../../utils/messageResponse");
const jwt = require('jsonwebtoken')
const { EVENT_STATUS } = require("../constants/Enum");
const { PublishMessage, SubscribeMessage } = require('../../utils/rabbitMQ');
const {checkAccessToken} = require('../middlewares/jwt_token');

module.exports = (app, channel) => {
    const service = new userService();

    // SubscribeMessage(channel, service);

    app.put("/user/:id",checkAccessToken,async (req, res) => {
        const user = req.data;
        const { id } = req.params;
        try {
            await service.update(id, user);
            const {payload} = await service.GetUserUpdatePayload(id,user,EVENT_STATUS.UPDATE.value);
            PublishMessage(channel,JSON.stringify(payload));
            res.json(responseSuccess());
        } catch (error) {
            res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
        }
    });

    app.post('/user/register',async (req, res) => {
        try {
            const user = req.body;
            
            const payload = await service.GetUserPayload(user,EVENT_STATUS.CREATE.value);
            PublishMessage(channel, JSON.stringify(payload));
            await service.create(user);
            res.json(responseSuccess())
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
    });


    app.post('/user/change-password',checkAccessToken,async (req, res) => {
        try {
            const userRequest = req.body;
            userRequest.userId = req.user.id;
            await service.changePassword(userRequest);
            const payload = service.GetUserPayload(userRequest,EVENT_STATUS.CHANGE_PASSWORD);
            PublishMessage(channel, JSON.stringify(payload));
            res.json(responseSuccess());
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
    });


    app.post('/user/verify-account',async (req, res) => {
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
    // // Forget_password
    // app.post('/user/forgot-password',async (req, res, next) => {
    //     const request = {
    //         token: req.body.token,
    //         password: req.body.password
    //     }
    //    await service.forgotPassword(request);
    //    PublishMessage(channel,JSON.stringify(payload));
    //     }).catch((err) => {
    //         res.send({
    //             error: 1,
    //             status: err.status || 500,
    //             message: err.message
    //         });
    //     });
    // });
        // Forget_password
        app.post('/user/delete',checkAccessToken,async (req, res, next) => {
            try{
            const options = {
                deleted: true
            }
            const payload = await service.GetUserPayload(user,EVENT_STATUS.DELETE.value);
            await service.delete(req.body.id,options);
            PublishMessage(channel,JSON.stringify(payload));
            res.json(responseSuccess());
        } catch (error) {
            res.json(responseWithError(error.error, error.message));
        }
        });
}
