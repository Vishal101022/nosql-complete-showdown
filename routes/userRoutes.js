const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", userController.signUp);
router.get("/users",auth.authMiddleware, userController.getUser);

module.exports = router;