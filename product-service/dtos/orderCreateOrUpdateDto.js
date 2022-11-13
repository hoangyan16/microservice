const Joi = require("joi");

exports.validateOrder = (data) => {
    const Order = Joi.object().keys({
        productId: Joi.number().integer()
            .required()
            .messages({
                'string.base': 'Mã sản phẩm không được để trống',
            }),
        quantity: Joi.number().integer()
            .required()
            .messages({
                'string.base': 'Số lượng sản phẩm không được để trống',
            }),
    }).options({ allowUnknown: true });
    const {value,error } = Order.validate(data);
    if(error && error.details.length >0){
        return Promise.reject({message:error.details[0].message});
    }
}