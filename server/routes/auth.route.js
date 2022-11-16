const express = require("express");
const {
  login,
  register,
  verifyEmail
} = require("../controllers/auth.controller");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify/:token", verifyEmail);
router.get("/test", (req, res) => {
  console.log(req.user);
});

module.exports = router;
