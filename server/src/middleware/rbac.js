const { ForbiddenError } = require('../utils/errors');

/**
 * Higher-order middleware that restricts access to specific roles.
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'MEMBER')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`));
    }

    next();
  };
};

module.exports = { requireRole };
