const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    maximum_members: {
      type: Number,
      default: 100,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Group", groupSchema);
