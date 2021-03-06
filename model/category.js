var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      max: 50,
      trim: true,
      required: [true, "名字不能为空"],
    },
    count: Number,
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

module.exports = mongoose.model("Category", categorySchema);
