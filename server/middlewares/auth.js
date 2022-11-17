const jwt = require("jsonwebtoken");
const { API_CODE_UNAUTHORIZED } = require("../constants");
const User = require("../models/user.model");

exports.isAuth = async (req, res, next) => {
  try {
    if (req.user) {
      next();
    } else {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        next();
      } else {
        return res.status(401).json({
          code: API_CODE_UNAUTHORIZED,
          message: "Not authorized",
          data: null
        });
      }
    }
  } catch (err) {
    res.status(401).json({
      code: API_CODE_UNAUTHORIZED,
      message: err.message,
      data: null
    });
  }
};
