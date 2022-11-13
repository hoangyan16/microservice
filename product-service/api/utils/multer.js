const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __basedir + "/resources/uploads");
    },
    filename: function (req, files, callback) {
        const new_name = `${
            files.originalname
        }`;
        callback(null, `${new_name}`);
    }
});
var storageOnMinio = multer.memoryStorage();
const upload = multer({storage: storage}).array("files");
const uploadMinio = multer({storage: storageOnMinio}).array("files");
module.exports = {upload,uploadMinio};
