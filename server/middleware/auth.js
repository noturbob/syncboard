const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient'); // Import redisClient

module.exports = async function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 1. Check if token is in the Redis blacklist
    const isBlacklisted = await redisClient.sIsMember('token_blacklist', token);
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token is blacklisted. Please log in again.' });
    }

    // 2. If not blacklisted, verify its signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};