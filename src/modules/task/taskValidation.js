const validateTask = (data) => {
  const errors = [];

  // Validate name (required string)
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ message: 'name is required and must be a string' });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: 'description must be a string or null' });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: 'due_date must be a valid date' });
    }
  }

  // Validate status (optional string, defaults to "TO_DO")
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push({ message: 'status must be a string' });
  }

  // Validate teamMembers (optional array of integers or null)
  if (data.teamMembers !== undefined && data.teamMembers !== null) {
    if (!Array.isArray(data.teamMembers) || !data.teamMembers.every(id => Number.isInteger(id))) {
      errors.push({ message: 'teamMembers must be an array of integers' });
    }
  }

  // Apply default status if not provided
  const validatedData = { ...data, status: data.status || 'TO_DO' };

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData };
};

const validateTaskUpdate = (data) => {
  const errors = [];

  // Validate name (required string)
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ message: 'name is required and must be a string' });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: 'description must be a string or null' });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: 'due_date must be a valid date' });
    }
  }

  // Validate status (optional string)
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push({ message: 'status must be a string' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

const validateTaskPatch = (data, isAdmin) => {
  const errors = [];

  // Ensure at least one field is provided
  if (!data.name && data.description === undefined && data.due_date === undefined && data.status === undefined && !data.comment) {
    errors.push({ message: 'At least one field (name, description, due_date, status, comment) is required' });
  }

  // Validate name (optional string)
  if (data.name !== undefined && typeof data.name !== 'string') {
    errors.push({ message: 'name must be a string' });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: 'description must be a string or null' });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: 'due_date must be a valid date' });
    }
  }

  // Validate status (optional string)
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push({ message: 'status must be a string' });
  }

  // Validate comment (optional string, required for non-admin if status is provided)
  if (data.comment !== undefined && typeof data.comment !== 'string') {
    errors.push({ message: 'comment must be a string' });
  } else if (!isAdmin && data.status && !data.comment) {
    errors.push({ message: 'comment is required when updating status for non-admin users' });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateTask, validateTaskUpdate, validateTaskPatch };