const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Assumes a previous middleware (like verifyToken) has attached the user to the request
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        error: "Forbidden",
        details: "Access denied. User role not available.",
      });
    }

    const { role } = req.user;

    if (allowedRoles.includes(role)) {
      next(); // User's role is in the allowed list, proceed to the controller
    } else {
      res.status(403).json({
        error: "Forbidden",
        details: "You do not have permission to perform this action.",
      });
    }
  };
};

module.exports = authorizeRole;
