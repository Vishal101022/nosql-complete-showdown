const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
    payment_id: {
      type: String,
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
