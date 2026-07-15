const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(d => d.message),
      });
    }

    next();
  };
};

const schemas = {
  login: Joi.object({
    initData: Joi.string().required(),
  }),

  createMatch: Joi.object({
    gameType: Joi.string().valid('rps').required(),
    opponentType: Joi.string().valid('ai', 'pvp').required(),
  }),

  submitMatch: Joi.object({
    matchId: Joi.string().uuid().required(),
    result: Joi.string().valid('win', 'loss', 'draw').required(),
    playerChoice: Joi.string().valid('rock', 'paper', 'scissors').required(),
    opponentChoice: Joi.string().valid('rock', 'paper', 'scissors').required(),
  }),

  updateProfile: Joi.object({
    displayName: Joi.string().max(50).optional(),
    avatar: Joi.string().uri().optional(),
  }),

  claimReward: Joi.object({
    rewardType: Joi.string().valid('daily', 'streak', 'mission').required(),
  }),
};

module.exports = { validate, schemas };
