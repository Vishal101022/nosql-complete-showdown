const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const isPremiumController = require("../controllers/isPremiumController");

router.get("/ispremium", auth.authMiddleware, isPremiumController.isPremium);

module.exports = router