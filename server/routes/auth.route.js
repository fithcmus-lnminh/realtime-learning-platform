const express = require("express");
const {
  login,
  register,
  verifyEmail
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify/:token", verifyEmail);

module.exports = router;
