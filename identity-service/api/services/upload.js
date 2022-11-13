exports.uploadOnServer = (req, res) => {
    var url = req.map(item => {
        console.log(item.path);
        return encodeURI(item.path.split(process.env.RESOLVE_PATH_ON_WIN)[1]);
    });
    return url
};
