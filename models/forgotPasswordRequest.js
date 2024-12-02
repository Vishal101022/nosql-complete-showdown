const mongoose = require("mongoose");

const forgotPasswordRequestsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, 
    },
    isActive: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPasswordRequests = mongoose.model(
  "ForgotPasswordRequests",
  forgotPasswordRequestsSchema
);

module.exports = ForgotPasswordRequests;
