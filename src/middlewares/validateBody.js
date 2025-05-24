export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message,
      type: err.type,
    }));
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors,
    });
  }
};
