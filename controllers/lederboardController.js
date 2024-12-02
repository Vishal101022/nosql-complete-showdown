const userModel = require("../models/userModel");

exports.leaderboard = async (req, res) => {
  try {
    const leaderboard = await userModel.find().sort({ totalExpense: -1 });
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
