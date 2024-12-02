const userModel = require('../models/userModel');
const bcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check user exists or not
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // compare password
        const passwordMatch = await bcypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // return token
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}