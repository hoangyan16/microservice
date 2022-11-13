const db = require("../../models/index");
const messageConstants = require('../constants/HTTPResponse');
const jwt = require("jsonwebtoken");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { signAccessToken, signRefreshToken } = require('../middlewares/jwt_token');
const {CreateStatus}= require('../constants/Enum');
const UserResponse = require('../../dtos/createUserResponseDto');

exports.create = async (user) => {
    try {
        const checkUserName = await db.Users.findOne({ where: { username: user.email } });
        if (checkUserName != null) {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_EXIST, message: "Người dùng đã tồn tại !" });
        };
        user.username = user.email;
        await db.Users.create(user);
        return new UserResponse("", "Tạo tài khoản thành công", CreateStatus.SUCCESS.value);
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};

exports.update = (id, request) => {
    return models.user.update(request, {
        where: {
            id: id
        }
    });
};
exports.delete = (id) => {
    return models.user.destroy({
        where: {
            id: id
        }
    });
};
exports.changePassword = async (request) => {
    try {
        const user = await db.Users.findOne({
            where: {
                id: request.userId
            }
        });
        if (user) {
            const isMatch = await bcrypt.compare(request.password, user.hashPassword)
            if (isMatch) {
                const isMatch2 = await bcrypt.compare(request.newPassword, user.hashPassword);
                if (!isMatch2) {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(request.newPassword, salt);
                    const options = {
                        hashPassword: hashPassword,
                        salt: salt
                    };
                    return db.Users.update(options, {
                        where: {
                            id: request.userId
                        }
                    });
                } else {
                    return Promise.reject({ error: ErrorCodes.ERROR_CODE_INVALID_USERNAME_OR_PASSWORD, message: 'Mật khẩu mới phải khác mật khẩu cũ !' });
                }
            } else {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_INVALID_PARAMETER, message: 'Mật khẩu cũ không đúng !' });
            }
        } else {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Người dùng không tồn tại !' });
        }
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};
exports.getUserByEmail = (email) => {
    return models.user.findOne({
        where: {
            email: email
        }
    });
};
// Forget-Password
exports.forgotPassword = async (request) => {
    const user = await models.user.findOne({
        where: {
            reset_code: request.token
        }
    });
    if (user) {
        const date = await models.user.findOne({
            where: {
                reset_code_valid: {
                    [Op.gte]: new Date()
                }
            }
        });
        if (date) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(request.password, salt);
            request.password = hashPassword;
            const options = {
                password: request.password
            };
            return models.user.update(options, {
                where: {
                    id: user.id
                }
            });
        } else {
            return Promise.resolve({ message: messageConstants.USER_VERIFY_DATE_EXPIRED });
        }
    } else {
        return Promise.resolve({ message: messageConstants.USER_USERNAME_NOT_EXIST });
    }
};

exports.login = async (account) => {
    try {
        const user = await db.User.findOne({
            where: {
                username: account.email
            }
        });
        if (user != null) {
            const isMatch = await bcrypt.compare(account.password, user.hashPassword);
            if (isMatch) {
                const access_token = signAccessToken(user);
                const refresh_token = signRefreshToken(user);
                const data = {
                    id: user.id,
                    gmail: user.email,
                    fullName: user.fullName,
                    access_token: access_token,
                    refresh_token: refresh_token
                };
                return data;
            } else {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_INVALID_USERNAME_OR_PASSWORD, message: 'Mật khẩu nhập vào không đúng !' });
            }
        } else {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Người dùng không tồn tại !' });
        }
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};
