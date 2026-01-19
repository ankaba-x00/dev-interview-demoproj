const rateLimit = require('express-rate-limit');

/**
 * Import limit
 * 3 files / 5 min
*/

const importLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Import limit exceeded: max 3 imports per 5 minutes',
  },
});

module.exports = importLimiter;
