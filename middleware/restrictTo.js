export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error("Forbidden: insufficient role");
      error.statusCode = 403;

      return next(error);
    }

    next();
  };
};
