const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Download = mongoose.model("Download", downloadSchema);

module.exports = Download;
