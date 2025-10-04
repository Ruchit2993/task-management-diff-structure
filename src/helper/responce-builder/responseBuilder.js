export const successResponse = (res, statusCode, message, payload = {}) => {
  res.status(statusCode).json({ message, ...payload });
};

export const errorResponse = (res, statusCode, message, errorMsg = null) => {
  const response = { message };
  if (errorMsg) response.error = errorMsg;
  res.status(statusCode).json(response);
};