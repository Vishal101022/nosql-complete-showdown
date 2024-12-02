const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => { 
    const { name, email, password } = req.body;
    try {
        // check user exists or not
        const user  = await userModel.findOne({ email });
        if(user) {
            return res.status(422).json({ error: "User already exists" });
        }
        // hash password
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        await userModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
    
}
exports.getUser = async (req, res) => {
  try {
      const userId = req.user;
      console.log("userId",userId);
    const user = await userModel.findOne({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}