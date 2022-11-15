const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.isAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else throw new Error("Not authorized!", 401);
  } catch (err) {
    next(err);
  }
};
