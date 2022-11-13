const { ErrorCodes } = require('../constants');
const { responseWithError } = require('../utils/messageResponse');

var validateRequestData = (schema) => {
    return (req, res, next) => {
        var validateObject = req.body;
        var result = schema.validate(validateObject, { abortEarly: false });
        if (result.error) {
            const errorData = result.error.message;
            res.json(responseWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, errorData));
        } else {
            req.data = validateObject;
            next();
        }
    }
}


let validate = {
    validateRequestData,
};

module.exports = {
    validate
};
