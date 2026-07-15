const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { MatchController } = require('../controllers/matchController');

router.post('/create', authenticate, validate(schemas.createMatch), MatchController.createMatch);
router.post('/:matchId/join', authenticate, MatchController.joinMatch);
router.post('/:matchId/result', authenticate, validate(schemas.submitMatch), MatchController.submitResult);
router.get('/history', authenticate, MatchController.getHistory);

module.exports = router;
