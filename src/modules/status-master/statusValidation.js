const validateStatus = (data) => {
  const errors = [];

  // Validate code (required, string, 3-50 chars)
  if (!data.code || typeof data.code !== 'string' || data.code.length < 3 || data.code.length > 50) {
    errors.push({ message: 'code is required and must be a string between 3 and 50 characters' });
  }

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: 'name is required and must be a string between 3 and 50 characters' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateStatusUpdate = (data) => {
  const errors = [];

  // Validate code (required, string, 3-50 chars)
  if (!data.code || typeof data.code !== 'string' || data.code.length < 3 || data.code.length > 50) {
    errors.push({ message: 'code is required and must be a string between 3 and 50 characters' });
  }

  // Validate name (required, string, 3-50 chars)
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50) {
    errors.push({ message: 'name is required and must be a string between 3 and 50 characters' });
  }

  // Validate status (optional, integer, 0 or 1)
  if (data.status !== undefined && (!Number.isInteger(data.status) || ![0, 1].includes(data.status))) {
    errors.push({ message: 'status must be an integer (0 or 1)' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateStatusPatch = (data) => {
  const errors = [];

  // Ensure at least one field is provided
  if (!data.code && !data.name && data.status === undefined) {
    errors.push({ message: 'At least one field (code, name, status) is required' });
  }

  // Validate code (optional, string, 3-50 chars)
  if (data.code !== undefined && (typeof data.code !== 'string' || data.code.length < 3 || data.code.length > 50)) {
    errors.push({ message: 'code must be a string between 3 and 50 characters' });
  }

  // Validate name (optional, string, 3-50 chars)
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 50)) {
    errors.push({ message: 'name must be a string between 3 and 50 characters' });
  }

  // Validate status (optional, integer, 0 or 1)
  if (data.status !== undefined && (!Number.isInteger(data.status) || ![0, 1].includes(data.status))) {
    errors.push({ message: 'status must be an integer (0 or 1)' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateStatus, validateStatusUpdate, validateStatusPatch };