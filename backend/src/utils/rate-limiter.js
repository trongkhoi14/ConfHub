const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  rateLimiter,
};