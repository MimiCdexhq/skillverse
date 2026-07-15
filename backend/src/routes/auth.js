const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validate(schemas.login), AuthController.login);

module.exports = router;
