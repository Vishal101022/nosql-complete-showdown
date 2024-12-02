const express = require('express');
const auth = require('../middleware/authMiddleware');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.post('/create-order', auth.authMiddleware, purchaseController.purchasePremium);
router.post('/verify-payment', auth.authMiddleware, purchaseController.updateTransactionStatus);

module.exports = router