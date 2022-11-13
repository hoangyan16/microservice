const jwt = require("jsonwebtoken");
const { ErrorCodes } = require("../constants");
const { responseSuccess, responseWithError } = require("../utils/messageResponse");

exports.signAccessToken = (req, res, next) => {
  try {
      return jwt.sign({
          iss: 'identity-service', 
          username: req.username, 
          iat: new Date().getTime(), 
          exp: new Date().setHours(new Date().getHours() + 1)
      }, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
      res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error'));
  }
};

exports.signRefreshToken= (req,res,next)=> { 
  try{
    return jwt.sign({
      iss: 'identity-service', 
      username: req.username, 
      iat: new Date().getTime(), 
      exp: new Date().setDate(new Date().getDate() + 7)
  }, process.env.ACCESS_TOKEN_SECRET);
  }catch(error){
    res.json(responseWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, 'error'));
      };
};

exports.checkAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user= decodedToken;
    next();
  } catch (error) {
    res.json(responseWithError(ErrorCodes.ERROR_CODE_FORBIDDEN, 'Invalid or expired token provided!'));
  }
};

exports.checkRefreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token provided!",
      error: error.message,
    });
  }
};


