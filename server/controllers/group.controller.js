const Group = require("../models/group.model");
const GroupUser = require("../models/groupUser.model");
const { API_CODE_SUCCESS, API_CODE_BY_SERVER } = require("../constants");

exports.getGroups = async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;

  try {
    const groups = await GroupUser.find(
      {
        user_id: req.user._id,
        role: role ? { $in: role } : { $ne: null }
      },
      { _id: 0, __v: 0, user_id: 0 }
    )
      .populate("group_id", "name maximum_members description")
      .skip((page - 1) * limit)
      .limit(limit * 1);

    const totalGroups = await GroupUser.countDocuments({
      user_id: req.user._id
    });

    const totalPages = Math.ceil(totalGroups / limit);

    res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: {
        groups,
        totalGroups,
        totalPages
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

exports.createGroup = async (req, res) => {
  const { name, description, maximum_members } = req.body;

  try {
    const group = await Group.create({ name, description, maximum_members });
    const groupUser = await GroupUser.create({
      group_id: group._id,
      user_id: req.user._id,
      role: "Owner"
    });

    res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: {
        _id: group._id,
        name: group.name,
        maximum_members: group.maximum_members,
        role: groupUser.role
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

exports.updateGroup = async (req, res) => {
  const { group_id } = req.params;
  const { name, description, maximum_members } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(
      group_id,
      { name, maximum_members },
      { new: true }
    );

    res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: {
        _id: group._id,
        name: group.name,
        maximum_members: group.maximum_members
      }
    });
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: error.message,
      data: null
    });
  }
};

exports.deleteGroup = async (req, res) => {
  const { group_id } = req.params;

  try {
    await Group.findByIdAndDelete(group_id);
    await GroupUser.deleteMany({ group_id });

    res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: null
    });
  } catch (err) {
    res.json({
      code: API_CODE_BY_SERVER,
      message: err.message,
      data: null
    });
  }
};
