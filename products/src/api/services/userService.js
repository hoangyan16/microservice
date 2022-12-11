const db = require("../../models/index");
const messageConstants = require('../constants/HTTPResponse');
const jwt = require("jsonwebtoken");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { signAccessToken, signRefreshToken } = require('../middlewares/jwt_token');
const { CreateStatus } = require('../constants/Enum');
const UserResponse = require('../../dtos/createUserResponseDto');

class UserService {
    async create(user) {
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

    update (id, request) {
        return models.user.update(request, {
            where: {
                id: id
            }
        });
    };
    delete(id,option) {
        try{
            return models.user.update(option,{
                where: {
                    id: id
                }
            });
        }catch(err){
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
        }
    };
    async changePassword (request) {
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
    getUserByEmail(email)  {
        return db.Users.findOne({
            where: {
                email: email
            }
        });
    };
    // Forget-Password
    async forgotPassword(request) {
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

    async GetUserUpdatePayload(id,user,event){

        if(user){
             const payload = { 
                event: event,
                data: { id,user }
            };
 
             return payload
        }else{
            return FormateData({error: 'No User Data Available'});
        }
 
    }
    async GetUserPayload(user,event){
        if(user){
             const payload = { 
                event: event,
                data: {user }
            };
             return payload
        }else{
            return FormateData({error: 'No User Data Available'});
        }
 
    }
 
};

module.exports = UserService;