const { ErrorCodes } = require('../constants/HTTPResponse');
const { responseWithError } = require('../../utils/messageResponse');
const Joi = require('joi');

var validateRequestData = (data,schema) => {
        schema.validate(data, (error,value)=>{
            if (error) {
                const errorData = error.message;
                return Promise.reject(errorData);
            }
        });
    }


module.exports = {
    validateRequestData
};
