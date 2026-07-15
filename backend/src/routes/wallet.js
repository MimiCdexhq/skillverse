const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { WalletController, RewardController } = require('../controllers/walletController');

router.get('/', authenticate, WalletController.getWallet);
router.get('/history', authenticate, WalletController.getTransactionHistory);
router.post('/daily-reward', authenticate, RewardController.claimDailyReward);

module.exports = router;
