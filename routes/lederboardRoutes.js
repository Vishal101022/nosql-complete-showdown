const express = require("express");
const router = express.Router();
const lederboardController = require("../controllers/lederboardController");
const premiumAuth = require("../middleware/isPremiumMiddleware");

router.get("/lederboard", premiumAuth.isPremium, lederboardController.leaderboard);

module.exports = router