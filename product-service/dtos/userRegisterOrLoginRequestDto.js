const Joi = require("joi");

exports.User = Joi.object({
    email: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': `Email không được để trống !`,
        }),
    password: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'Mật khẩu không được để trống',
        })
});