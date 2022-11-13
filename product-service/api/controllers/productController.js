'use trict'
const productService = require('../services/productService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseWithError } = require("../utils/messageResponse");


exports.getByConditions = async (req, res) => {
    try {
        const data = await productService.getByConditions(req.query);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
    }
};


exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await productService.getById(id);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.createOrUpdate = async (req, res) => {
    try {
        const lstProduct = req.body;
        const response = await productService.createOrUpdate(lstProduct);
        res.json((response));
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.delete = async (req, res) => {
    try {
        const lstId = req.body;
        const response = await productService.delete(lstId);
        res.json(response);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


