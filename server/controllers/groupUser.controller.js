const GroupUser = require("../models/groupUser.model");
const { API_CODE_SUCCESS, API_CODE_BY_SERVER } = require("../constants");

exports.getGroupUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { group_id } = req.params;

  try {
    const groupUsers = await GroupUser.find({ group_id })
      .populate("user_id", "name email")
      .skip((page - 1) * limit)
      .limit(limit * 1);

    const totalPages =
      ((await GroupUser.countDocuments({ group_id })) + limit - 1) / limit;

    res.json({
      code: API_CODE_SUCCESS,
      message: "Success",
      data: {
        groupUsers,
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
