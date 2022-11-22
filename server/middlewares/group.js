const GroupUser = require("../models/groupUser.model");
const { API_CODE_PERMISSION_DENIED } = require("../constants");

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

exports.isFullMember = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    group = await Group.findById(group_id);

    if (await group.isFullMember()) {
      res.status(403).json({
        code: API_CODE_PERMISSION_DENIED,
        message: "Group is full",
        data: null
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({
      code: API_CODE_PERMISSION_DENIED,
      message: err.message,
      data: null
    });
  }
};
