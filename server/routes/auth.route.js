const express = require("express");
const {
  login,
  logout,
  register,
  verifyEmail
} = require("../controllers/auth.controller");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuth, logout);
router.post("/register", register);
router.post("/verify/:token", verifyEmail);
router.get("/test", isAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
