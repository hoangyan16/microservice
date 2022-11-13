const Joi = require("joi");

exports.validateProduct = (data) => {
    const Product = Joi.object().keys({
        title: Joi.string()
            .required("Ten")
            .trim()
            .messages({
                'string.base': `Tên sản phẩm không được để trống !`,
            }),
        categoryId: Joi.number().integer()
            .required()
            .messages({
                'string.base': 'Mã loại sản phẩm không được để trống',
            }),
        price: Joi.number().integer()
            .required()
            .messages({
                'string.base': 'Gía sản phẩm không được để trống',
            }),
    }).options({ allowUnknown: true });
    const {value,error } = Product.validate(data);
    if(error && error.details.length >0){
        return Promise.reject({message:error.details[0].message});
    }
}