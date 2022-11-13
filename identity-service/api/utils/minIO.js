const Minio = require("minio");
require("dotenv").config();

const config = require(__dirname + "/../../config/minio.json");
exports.minioClient = new Minio.Client({ 
    endPoint: config.endPoint, 
    port: config.port, 
    useSSL: config.useSSL, 
    accessKey: config.accessKey, 
    secretKey: config.secretKey 
});
