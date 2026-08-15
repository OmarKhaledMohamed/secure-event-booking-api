export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      error.statusCode = 400;
      error.isJoi = true;

      return next(error);
    }

    next();
  };
};
