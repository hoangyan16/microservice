'use trict'
const categoryService = require('../services/categoryService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseSuccess,responseWithError } = require("../utils/messageResponse");


exports.getByConditions = async (req, res) => {
    try {
        const data = await categoryService.getByConditions();
        res.json(data);
    } catch (error) {
        res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
    }
};


exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await categoryService.getById(id);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.createOrUpdate = async (req, res) => {
    try {
        const lstCategory = req.body;
        const response = await categoryService.createOrUpdate(lstCategory);
        res.json((response));
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.delete = async (req, res) => {
    try {
        const lstId = req.body;
        const response = await categoryService.delete(lstId);
        res.json(response);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


