const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const { API_CODE_SUCCESS, API_CODE_BY_SERVER } = require("../constants");

exports.updateAccount = async (req, res, next) => {
  const { first_name, last_name } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { first_name, last_name },
      { new: true }
    );

    // console.log(user);

    return res.json({
      code: API_CODE_SUCCESS,
      message: "Update account successfully",
      data: {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        token: user.token
      }
    });
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: err.message,
      data: null
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const { password } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    const token = generateToken(user._id, process.env.JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.token = token;
    user.password = hashedPassword;
    await user.save();

    return res.json({
      code: API_CODE_SUCCESS,
      message: "Password has been updated",
      data: {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        token
      }
    });
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: err.message,
      data: null
    });
  }
};
