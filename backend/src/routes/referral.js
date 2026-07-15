const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { ReferralController } = require('../controllers/referralController');

router.post('/', authenticate, ReferralController.createReferral);
router.get('/', authenticate, ReferralController.getReferrals);
router.get('/stats', authenticate, ReferralController.getReferralStats);

module.exports = router;
