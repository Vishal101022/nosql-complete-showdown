const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

exports.isPremium = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId);

    if (user.isPremiumUser) {
      console.log("user is premium");
      req.user = user.id;
      next();
    } else {
      return res.status(402).json({ error: "Not a premium user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
