const GroupUser = require("../models/groupUser.model");
const Group = require("../models/group.model");
const {
  API_CODE_PERMISSION_DENIED,
  API_CODE_NOTFOUND,
  API_CODE_BY_SERVER
} = require("../constants");

exports.handleJoinGroup = async (req, res, next) => {
  const { group_id } = req.params;
  const { user, group } = req;

  try {
    const groupUser = await GroupUser.findOne({
      group_id,
      user_id: user._id
    });

    if (groupUser) {
      return res.json({
        code: API_CODE_PERMISSION_DENIED,
        message: "You have already joined this group",
        data: null
      });
    }

    const totalMembers = await GroupUser.countDocuments({
      group_id
    });

    if (totalMembers >= group.maximum_members) {
      return res.json({
        code: API_CODE_PERMISSION_DENIED,
        message: "Group is full",
        data: null
      });
    }

    next();
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: err.message,
      data: null
    });
  }
};

exports.isGroupExist = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    const group = await Group.findOne({ _id: group_id });

    if (!group) {
      res.json({
        code: API_CODE_NOTFOUND,
        message: "Group does not exist",
        data: null
      });
    } else {
      req.group = group;
      next();
    }
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: err.message,
      data: null
    });
  }
};

exports.isInGroup = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    const groupUser = await GroupUser.findOne({
      group_id,
      user_id: req.user._id
    });

    if (groupUser) {
      req.groupUser = groupUser;
      next();
    } else {
      res.status(403).json({
        code: API_CODE_PERMISSION_DENIED,
        message: "Permission denied",
        data: null
      });
    }
  } catch (err) {
    res.status(403).json({
      code: API_CODE_PERMISSION_DENIED,
      message: err.message,
      data: null
    });
  }
};

exports.isGroupOwner = async (req, res, next) => {
  if (req.groupUser.role === "Owner") {
    next();
  } else {
    res.status(403).json({
      code: API_CODE_PERMISSION_DENIED,
      message: "Permission denied",
      data: null
    });
  }
};

exports.handleLeaveGroup = async (req, res, next) => {
  const { groupUser } = req;

  if (groupUser.role === "Owner") {
    res.status(403).json({
      code: API_CODE_PERMISSION_DENIED,
      message: "Please transfer ownership to another member before leaving",
      data: null
    });
  } else {
    next();
  }
};
