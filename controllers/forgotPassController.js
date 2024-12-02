const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const user = require("../models/userModel");
const ForgotPasswordRequests = require("../models/forgotPasswordRequest");
const dotenv = require("dotenv");
dotenv.config();

// Forgot Password Request
exports.forgot = async (req, res, next) => {
  try {
    const user1 = await user.findOne({ email: req.body.email });
    if (user1) {
      const uuid = uuidv4();
      await ForgotPasswordRequests.create({
        _id: uuid,
        isActive: true,
        userId: user1.id,
      });

      // Set up Brevo API client
      Sib.ApiClient.instance.authentications["api-key"].apiKey =
        process.env.SMPT_API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "viahal101022@gmail.com",
        name: "Expense App",
      };
      const receivers = [{ email: req.body.email }];

      // Sending the transactional email
      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "RESET PASSWORD",
        textContent: `
          <h2>Click below link to reset:</h2>
          http://localhost:3000/password/resetpassword/${uuid}
          <h4>Same link will not work after the link is opened.</h4>
        `,
      });

      res.status(200).send("Email sent successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(
      "Error sending email:",
      error.response ? error.response.body : error.message
    );
    res.status(500).send("Server error");
  }
};

// Reset Password - Render New Password Page
exports.reset = async (req, res, next) => {
  try {
    const result = await ForgotPasswordRequests.findOne({
      _id: req.params.id ,
    });
    if (result && result.isActive == true) {
      // Send reset password page
      res
        .status(200)
        .sendFile(path.join(__dirname, "..", "views", "newPassword.html"));

      // Update `isActive` to false
      await result.update({ isActive: false });
    } else {
      res.status(400).json({ message: "Invalid or expired link" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Update Password
exports.update = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const foundUser = await user.findOne({email: req.body.email });

    if (foundUser) {
      await foundUser.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedPassword }
      )
      res.status(200).send("Password updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
