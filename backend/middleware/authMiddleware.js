const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const authMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (role && req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden, insufficient privileges' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = authMiddleware;