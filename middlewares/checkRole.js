const checkRole = (role) => {
  return (req, res, next) => {
    if (req.jwt && req.jwt.role === role) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "ACCESS_DENIED",
      });
    }
  };
};

export default checkRole;
