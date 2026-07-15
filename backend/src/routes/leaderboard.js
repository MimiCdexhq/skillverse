const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { LeaderboardController } = require('../controllers/leaderboardController');

router.get('/skillscore', LeaderboardController.getBySkillScore);
router.get('/mim', LeaderboardController.getByMim);
router.get('/games', LeaderboardController.getByGames);
router.get('/streak', LeaderboardController.getByStreak);
router.get('/referrals', LeaderboardController.getByReferrals);
router.get('/halloffame', LeaderboardController.getHallOfFame);

module.exports = router;
