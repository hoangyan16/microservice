const Joi = require("joi");

exports.Category = Joi.object({
    display: Joi.string()
        .required()
        .trim()
        .messages({
        'string.base': `Tên loại sản phẩm không được để trống !`,
        }),
}).options({allowUnknown: true});