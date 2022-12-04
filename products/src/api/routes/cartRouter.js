const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const { validate } = require('../middlewares/validators');
const {checkAccessToken} = require('../middlewares/jwt_token');

router.get('/',checkAccessToken, cartController.getByConditions);
router.get("/:id", cartController.getById);
router.post('/',cartController.createOrUpdate);
router.post('/delete',cartController.delete);

module.exports = router;
