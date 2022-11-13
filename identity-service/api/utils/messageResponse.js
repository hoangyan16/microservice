const { ErrorCodes } = require('../constants')

function responseSuccess(data, message = 'Success') {
    return {
        code: ErrorCodes.ERROR_CODE_SUCCESS,
        message,
        data,
    };
}

function responseWithError(errorCode, message ) {
    return {
        code: errorCode,
        message : message
    };
}

module.exports = { responseSuccess, responseWithError }