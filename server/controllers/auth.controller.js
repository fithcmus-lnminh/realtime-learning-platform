const bcrypt = require("bcryptjs");
const {
  API_CODE_SUCCESS,
  API_CODE_NOTFOUND,
  API_CODE_BY_SERVER,
  API_CODE_VALIDATION_ERROR
} = require("../constants");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.activated) {
        return res.json({
          code: API_CODE_SUCCESS,
          message: "Success",
          data: {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token: generateToken(user._id, process.env.JWT_SECRET)
          }
        });
      } else {
        return res.json({
          code: API_CODE_VALIDATION_ERROR,
          message: "Account has not already been verified",
          data: null
        });
      }
    } else {
      res.json({
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
      throw new Error("Email has already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      activated: false
    });

    if (user) {
      res.json({
        code: API_CODE_SUCCESS,
        message: "Success",
        data: null
      });
      const token = generateToken(user._id, process.env.EMAIL_VERIFIY_SECRET);

      const verifyLink =
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000/verify/"
          : ".../verify/") + token;

      await sendMail(
        user.email,
        "Verify Account",
        `<div style="font-size: 16px">
          <p>Hi ${user.first_name + " " + user.last_name},</p>
          <p>Please click the link below to verify account on Realtime Learning Platform Website</p>
          <a href="${verifyLink}">${verifyLink}</a>
          <p>Thank you!</p>
        </div>`
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFIY_SECRET);

    const user = await User.updateOne({ _id: decoded.id }, { activated: true });

    return res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: null
    });
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: " ",
      data: null
    });
  }
};

exports.logout = (req, res, next) => {
  delete req.user;
  return res.json({
    code: 0,
    message: "Success",
    data: null
  });
};

exports.loginWithGoogle = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })(req, res, next);
};

exports.loginGoogleCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/verify/google-login-error",
    session: true
  })(req, res, next);
};
