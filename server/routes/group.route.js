const express = require("express");
const {
  createGroup,
  getGroup,
  getGroups,
  updateGroup,
  deleteGroup
} = require("../controllers/group.controller");
const { isAuth } = require("../middlewares/auth");
const { isInGroup, isGroupOwner } = require("../middlewares/group");
const GroupUserRouter = require("./groupUser.route");

const router = express.Router();

router.use(isAuth);
router.get("/", getGroups);
router.post("/", createGroup);

router.use("/:group_id", isInGroup, isGroupOwner);

router.put("/:group_id", updateGroup);
router.delete("/:group_id", deleteGroup);

router.use("/:group_id/user", GroupUserRouter);

module.exports = router;
