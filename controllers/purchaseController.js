const Razorpay = require("razorpay");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
require("dotenv").config();

const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.purchasePremium = async (req, res) => {
  const userId = req.user;
  try {
    const { amount, currency } = req.body;
    const Order = await razorpay.orders.create({
      amount: amount * 100, // Amount in smallest currency unit
      currency: currency,
    });

    
    const order = new orderModel({
      order_id: Order.id,
      amount: Order.amount,
      status: "pending",
      user: userId,
    });
    await order.save();

    return res.status(201).json({
      id: Order.id,
      amount: Order.amount,
      currency: Order.currency,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const userId = req.user;
  try {
    // Validate the payment signature
    const isValidSignature = validateWebhookSignature(
      razorpay_order_id + "|" + razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValidSignature) {
      return res.status(400).json({ status: "verification_failed" });
    }

    // Find the order and update payment details
    const order = await orderModel.findOne({ order_id: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.payment_id = razorpay_payment_id;
    order.status = "paid";
    await order.save();

    // Update user's premium status
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isPremiumUser = true;
    await user.save();

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

