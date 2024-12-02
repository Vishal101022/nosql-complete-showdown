const User = require('../models/userModel');

exports.isPremium = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
            return res.status(200).json({ isPremium: user.isPremiumUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}