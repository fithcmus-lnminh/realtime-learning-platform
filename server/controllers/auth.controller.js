const bcrypt = require("bcryptjs");
const { API_CODE_SUCCESS, API_CODE_NOTFOUND } = require("../constants");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        code: API_CODE_SUCCESS,
        message: "Success",
        data: {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        code: API_CODE_NOTFOUND,
        message: "Invalid email or password",
        data: null
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Email has already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        code: API_CODE_SUCCESS,
        message: "Success",
        data: null
      });
    } else {
      res.status(401).json({
        code: API_CODE_NOTFOUND,
        message: "Invalid email or password",
        data: null
      });
    }
  } catch (err) {
    next(err);
  }
};
