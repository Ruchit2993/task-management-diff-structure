const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.length <= 50 && emailRegex.test(email);
};

const validateUser = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: 'name is required and must be a string between 3 and 50 characters' });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: 'contact must be a string between 10 and 12 characters or null' });
  }

  // Validate password (required, string, min 6 chars)
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ message: 'password is required and must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateUserUpdate = (data) => {
  const errors = [];

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: 'name is required and must be a string between 3 and 50 characters' });
  }

  // Validate email (required, valid email, max 50 chars)
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ message: 'email is required and must be a valid email address with max 50 characters' });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: 'contact must be a string between 10 and 12 characters or null' });
  }

  // Validate password (optional, string, min 6 chars)
  if (data.password !== undefined && (typeof data.password !== 'string' || data.password.length < 6)) {
    errors.push({ message: 'password must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateUserPatch = (data) => {
  const errors = [];

  // Ensure at least one field is provided
  if (!data.name && !data.email && data.contact === undefined && !data.password) {
    errors.push({ message: 'At least one field (name, email, contact, password) is required' });
  }

  // Validate name (optional, string, 3-50 chars)
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50)) {
    errors.push({ message: 'name must be a string between 3 and 50 characters' });
  }

  // Validate email (optional, valid email, max 50 chars)
  if (data.email !== undefined && !validateEmail(data.email)) {
    errors.push({ message: 'email must be a valid email address with max 50 characters' });
  }

  // Validate contact (optional, string, 10-12 chars, nullable)
  if (data.contact !== undefined && data.contact !== null && (typeof data.contact !== 'string' || data.contact.length < 10 || data.contact.length > 12)) {
    errors.push({ message: 'contact must be a string between 10 and 12 characters or null' });
  }

  // Validate password (optional, string, min 6 chars)
  if (data.password !== undefined && (typeof data.password !== 'string' || data.password.length < 6)) {
    errors.push({ message: 'password must be a string with at least 6 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateUser, validateUserUpdate, validateUserPatch };