var {
    minioClient
} = require('../../utils/minIO');
require("dotenv").config();
const config = require(__dirname + "/../../config/minio.json");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseSuccess, responseWithError } = require('../../utils/messageResponse');

exports.uploadOnMinio = async (req, res) => {
    let dataArray = [];
    for (var i = 0; i < req.files.length; i++) {
        let element = req.files[i];
        const response = await minioClient.putObject(config.bucketName, element.originalname, element.buffer);
        if (!response.etag) {
            let errorUpload = {
                filename: element.originalname,
                error: response
            };
             dataArray.push(errorUpload);
        } else {
            let dataObject = {
                filename: element.originalname,
                etag: response.etag
            };
             dataArray.push(dataObject);
        }
    }
    res.json(responseSuccess(dataArray));
};

exports.download = (req, res) => {
    minioClient.getObject(config.bucketName, req.query.filename, function (error, stream) {
        if (error) {
            return res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, error));
        }
        stream.pipe(res);
    });
};
