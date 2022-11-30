'use trict'
const userService = require('../services/user');
const mailService = require('../services/mail');
const { ErrorCodes } = require("../constants");
const { responseSuccess, responseWithError } = require("../utils/messageResponse");
const jwt = require('jsonwebtoken');
const amqplib = require("amqplib");
const {CreateChannel} = require('../utils/rabbitMQ');

CreateChannel().then((channel)=>{
    channel.consume("IDENTITY", message =>{
        const payload =  JSON.parse(message.content);
        const {event,data} = payload;
        switch(event){
            case 1: 
            userService.create(data);
            break;
            case 2:
            userService.update(data.id, data);
            break;
            case 3:
            userService.changePassword(data);
            break;
        }
        channel.ack(message);
    })
}

);

async function update(req, res) {
    try {
        const id = req.params.id;
        const user = req.body;
        await userService.update(id, user);
        return true
    } catch (error) {
        res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
    }
};


async function login (req, res){
    const user = req.data;
    try {
        const result = await userService.login(user);
        return result;
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


async function register (req, res) {
    try {
        await userService.create(user);
        return user;
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


async function changePassword (req, res) {
    try {
        const data = req.body;
        await userService.changePassword(data);
        res.json(responseSuccess());
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


async function sendMailVerify(req, res) {
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
async function  forgotPassword (req, res, next) {
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

module.exports={register,update,changePassword,forgotPassword,sendMailVerify,login};