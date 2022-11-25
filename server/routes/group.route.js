const express = require("express");
const {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  inviteUser,
  joinGroup
} = require("../controllers/group.controller");
const { isAuth } = require("../middlewares/auth");
const {
  isGroupExist,
  isInGroup,
  isGroupOwner,
  handleJoinGroup
} = require("../middlewares/group");
const GroupUserRouter = require("./groupUser.route");

const router = express.Router();

router.use(isAuth);
router.get("/", getGroups);
router.post("/", createGroup);

router.use("/:group_id", isGroupExist);

router.post("/:group_id/invite", isInGroup, inviteUser);
router.post("/:group_id/join", handleJoinGroup, joinGroup);

router.use("/:group_id", isInGroup, isGroupOwner);

router.put("/:group_id", updateGroup);
router.delete("/:group_id", deleteGroup);

router.use("/:group_id/user", GroupUserRouter);

module.exports = router;
