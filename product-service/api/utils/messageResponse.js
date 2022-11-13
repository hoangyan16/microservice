const {ErrorCodes} = require('../../api/constants/HTTPResponse');

function responseSuccess(message) {
    return {
        code: ErrorCodes.ERROR_CODE_SUCCESS,
        message : message,
        status: 1
    };
}

function responseSuccessWithData(data,message) {
    return {
        code: ErrorCodes.ERROR_CODE_SUCCESS,
        message : message,
        status: 1
    };
}

function responseWithError(errorCode, message ) {
    return {
        code: errorCode,
        message : message,
        status: 0
    };
}

module.exports = {responseSuccess,responseWithError }