const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../middleware/authMiddleware");
const premiumAuth = require("../middleware/isPremiumMiddleware");

router.post("/expense", auth.authMiddleware, expenseController.createExpense);
router.get("/expenses", auth.authMiddleware, expenseController.getExpenses);  
router.get("/totals", auth.authMiddleware, expenseController.getTotals);
router.delete("/expense/:id",auth.authMiddleware, expenseController.deleteExpense);
router.patch("/expense/:id", auth.authMiddleware, expenseController.updateExpense);
router.patch("/totalincome", auth.authMiddleware, expenseController.updateTotalIncome);
router.post("/expenses/download", premiumAuth.isPremium, expenseController.postexpenseDownload);
router.get("/expenses/download", premiumAuth.isPremium, expenseController.getexpenseDownload);

module.exports = router;