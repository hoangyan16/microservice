const express = require('express');
const router = express.Router();
var Multer = require("multer");
const uploadController = require("../controllers/upload");

router.post('/upload', Multer({storage: Multer.memoryStorage()}).array("files"), uploadController.uploadOnMinio);
router.get('/download', uploadController.download);


module.exports = router;
