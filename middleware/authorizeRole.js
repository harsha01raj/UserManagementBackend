const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

module.exports=authorizeRole;