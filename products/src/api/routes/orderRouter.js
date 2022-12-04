const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");
const { validate } = require('../middlewares/validators');
const { Category } = require('../../dtos/categoryCreateOrUpdateDto');
const {checkAccessToken} = require('../middlewares/jwt_token');
router.get('/', orderController.getByConditions);
router.get("/:id", orderController.getById);
router.post('/',checkAccessToken,orderController.createOrUpdate);
router.post('/delete', orderController.delete);

module.exports = router;
