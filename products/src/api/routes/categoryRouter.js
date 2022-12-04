const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { validate } = require('../middlewares/validators');
const{Category} = require('../../dtos/categoryCreateOrUpdateDto');

router.get('/',categoryController.getByConditions);
router.get("/:id", categoryController.getById);
router.post('/',categoryController.createOrUpdate);
router.post('/delete',categoryController.delete);

module.exports = router;
