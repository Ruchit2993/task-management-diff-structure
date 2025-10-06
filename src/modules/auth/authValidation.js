import messages from "../../helper/constants/messages.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.length <= 50 && emailRegex.test(email);
};

const validateRegister = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: messages.VALIDATION.NAME_INVALID });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  // Validate contact (optional, string, 9-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 9 || data.contact.length > 12)) {
    errors.push({ message: messages.VALIDATION.CONTACT_INVALID });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: messages.VALIDATION.PASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateLogin = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: messages.VALIDATION.PASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateChangePassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: messages.VALIDATION.NEWPASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateFirstChangePassword = (data) => {
  const errors = [];

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: messages.VALIDATION.NEWPASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateForgotPassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateResetPassword = (data) => {
  const errors = [];

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  // Validate newPassword (required, string, min 6 chars)
  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ message: messages.VALIDATION.NEWPASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateRegister, validateLogin, validateChangePassword, validateFirstChangePassword, validateForgotPassword, validateResetPassword };