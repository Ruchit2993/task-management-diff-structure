import messages from "../../helper/constants/messages.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.length <= 50 && emailRegex.test(email);
};

const validateUser = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: messages.VALIDATION.NAME_REQUIRED });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_REQUIRED });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: messages.VALIDATION.CONTACT_OPTIONAL_INVALID });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: messages.VALIDATION.PASSWORD_REQUIRED });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateUserUpdate = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: messages.VALIDATION.NAME_REQUIRED });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_REQUIRED });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: messages.VALIDATION.CONTACT_OPTIONAL_INVALID });
  }

  // Validate password (optional, string, min 6 chars)
  if (data.password !== undefined && (typeof data.password !== 'string' || data.password.length < 6)) {
    errors.push({ message: messages.VALIDATION.PASSWORD_REQUIRED });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateUserPatch = (data) => {
  const errors = [];

  // Ensure at least one field is provided
  if (!data.name && !data.email && data.contact === undefined && !data.password) {
    errors.push({ message: messages.VALIDATION.USER_PATCH_FIELDS_REQUIRED });
  }

  // Validate name (optional, string, 3-50 chars)
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50)) {
    errors.push({ message: messages.VALIDATION.NAME_OPTIONAL_INVALID });
  }

  // Validate email (optional, valid email, max 50 chars)
  if (data.email !== undefined && !validateEmail(data.email)) {
    errors.push({ message: messages.VALIDATION.EMAIL_INVALID });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: messages.VALIDATION.CONTACT_INVALID });
  }

  // Validate password (optional, string, min 6 chars)
  if (data.password !== undefined && (typeof data.password !== 'string' || data.password.length < 6)) {
    errors.push({ message: messages.VALIDATION.PASSWORD_INVALID });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateUser, validateUserUpdate, validateUserPatch };