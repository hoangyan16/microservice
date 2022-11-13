const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const { validate } = require('../middlewares/validators');
const {Product} = require('../../dtos/productCreateOrUpdateDto');

router.get('/',productController.getByConditions);
router.get("/:id", productController.getById);
router.post('/',productController.createOrUpdate);
router.post('/delete',productController.delete);

module.exports = router;
