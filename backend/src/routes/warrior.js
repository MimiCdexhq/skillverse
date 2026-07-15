const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { WarriorController } = require('../controllers/warriorController');

router.get('/profile', authenticate, WarriorController.getProfile);
router.get('/stats', authenticate, WarriorController.getStats);
router.put('/profile', authenticate, validate(schemas.updateProfile), WarriorController.updateProfile);

module.exports = router;
