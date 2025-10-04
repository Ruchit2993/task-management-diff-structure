const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.length <= 50 && emailRegex.test(email);
};

const validateRegister = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: 'name is required and must be a string between 3 and 50 characters' });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate contact (optional, string, 9-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 9 || data.contact.length > 12)) {
    errors.push({ message: 'contact must be a string between 9 and 12 characters or null' });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: 'password is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateLogin = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: 'password is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateChangePassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: 'newPassword is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateFirstChangePassword = (data) => {
  const errors = [];

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: 'newPassword is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateForgotPassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateResetPassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: 'newPassword is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateFirstChangePassword,
  validateForgotPassword,
  validateResetPassword,
};