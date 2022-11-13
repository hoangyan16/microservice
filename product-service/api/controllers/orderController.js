'use trict'
const orderService = require('../services/orderService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseWithError } = require("../utils/messageResponse");


exports.getByConditions = async (req, res) => {
    try {
        const data = await orderService.getByConditions();
        res.json(data);
    } catch (error) {
        res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error', error));
    }
};


exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await orderService.getById(id);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.createOrUpdate = async (req, res) => {
    try {
        const lstOrder = req.body;
        const username = req.user.username;
        const response = await orderService.createOrUpdate(lstOrder,username);
        res.json((response));
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.delete = async (req, res) => {
    try {

        const lstId = req.body;
        await orderService.delete(lstId);
        res.json(responseSuccess());
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


