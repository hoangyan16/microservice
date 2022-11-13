'use trict'
const cartService = require('../services/cartService');
const { ErrorCodes } = require("../constants/HTTPResponse");
const { responseWithError } = require("../utils/messageResponse");


exports.getByConditions = async (req, res) => {
    try {
        const username = req.user.username;
        const {query} = req;
        const data = await cartService.getByConditions(username,query);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await cartService.getById(id);
        res.json(data);
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.createOrUpdate = async (req, res) => {
    try {
        const category = req.data;
        const response = await cartService.createOrUpdate(category);
        res.json((response));
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


exports.delete = async (req, res) => {
    try {

        const lstId = req.body;
        await cartService.delete(lstId);
        res.json(responseSuccess());
    } catch (error) {
        res.json(responseWithError(error.error, error.message));
    }
};


