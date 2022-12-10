const db = require("../../models/index");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const { ErrorCodes } = require("../constants");
const { signAccessToken, signRefreshToken } = require('../middlewares/jwt_token');

class UserService {
    async create(user) {
        try {
            const checkUserName = await db.Users.findOne({ where: { username: user.email } });
            if (checkUserName != null) {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_EXIST, message: "Người dùng đã tồn tại !" });
            };
            const salt = await bcrypt.genSalt(10);
            if (!user.password) {
                user.password = "User@123456";
            }
            const hashPassword = await bcrypt.hash(user.password, salt);
            user.hashPassword = hashPassword;
            user.salt = salt;
            user.username = user.email;
            return db.Users.create(user);
        } catch (error) {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: error });
        }
    };

    update(id, request) {
        return db.Users.update(request, {
            where: {
                id: id
            }
        });
    };
    delete(id) {
        return db.Users.destroy({
            where: {
                id: id
            }
        });
    };
    async changePassword(request) {
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
    getUserByEmail(email) {
        return db.Users.findOne({
            where: {
                email: email
            }
        });
    };
    // Forget-Password
    async forgotPassword(request) {
        const user = await db.Users.findOne({
            where: {
                reset_code: request.token
            }
        });
        if (user) {
            const date = await db.Users.findOne({
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
                return db.Users.update(options, {
                    where: {
                        id: user.id
                    }
                });
            } else {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_IN_USE, message: 'Hết hạn!' });
            }
        } else {
            return Promise.resolve({ message: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Người dùng không tồn tại! ' });
        }
    };

    async login(account) {
        try {
            const user = await db.Users.findOne({
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
    }
    async SubscribeEvents(payload) {
        payload = JSON.parse(payload);
        console.log(payload);

        const { event, data } = payload;
        const { id, user } = data;

        switch (event) {
            case 1:
                try {
                    this.create(user);
                    return ("Tạo người dùng thành công!");
                } catch (err) {
                    return err;
                }
            case 2:
                try {
                    this.update(id, user);
                    return ("Cập nhật người dùng thành công !");
                } catch (err) {
                    return err
                }
            case 3:
                try {
                    this.changePassword(user);
                    return ("Cập nhật mật khẩu thành công !");
                } catch (err) {
                    return err
                }
            case 4:
                try {
                    this.forgotPassword(user);
                    return ("Cập nhật mật khẩu thành công !");
                } catch (err) {
                    return err
                }
            default:
                break;
        }

    }
};

module.exports = UserService;