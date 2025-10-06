import messages from "../../helper/constants/messages.js";


const validateTask = (data) => {
  const errors = [];

  // Validate name (required string)
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_NAME_REQUIRED });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_DESCRIPTION_INVALID });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: messages.VALIDATION.TASK_DUE_DATE_INVALID });
    }
  }

  // Validate status (optional string, defaults to "TO_DO")
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_STATUS_INVALID });
  }

  // Validate teamMembers (optional array of integers or null)
  if (data.teamMembers !== undefined && data.teamMembers !== null) {
    if (!Array.isArray(data.teamMembers) || !data.teamMembers.every(id => Number.isInteger(id))) {
      errors.push({ message: messages.VALIDATION.TASK_TEAM_MEMBERS_INVALID });
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
    errors.push({ message: messages.VALIDATION.TASK_NAME_REQUIRED });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_DESCRIPTION_INVALID });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: messages.VALIDATION.TASK_DUE_DATE_INVALID });
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
    errors.push({ message: messages.VALIDATION.PATCH_FIELDS_REQUIRED });``
  }

  // Validate name (optional string)
  if (data.name !== undefined && typeof data.name !== 'string') {
    errors.push({ message: messages.VALIDATION.NAME_OPTIONAL_INVALID });
  }

  // Validate description (optional string or null)
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ message: messages.VALIDATION.DESCRIPTION_OPTIONAL_INVALID });
  }

  // Validate due_date (optional valid date or null)
  if (data.due_date !== undefined && data.due_date !== null) {
    if (isNaN(new Date(data.due_date).getTime())) {
      errors.push({ message: messages.VALIDATION.TASK_DUE_DATE_INVALID });
    }
  }

  // Validate status (optional string)
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_STATUS_INVALID });
  }

  // Validate comment (optional string, required for non-admin if status is provided)
  if (data.comment !== undefined && typeof data.comment !== 'string') {
    errors.push({ message: messages.VALIDATION.TASK_COMMENT_INVALID });
  } else if (!isAdmin && data.status && !data.comment) {
    errors.push({ message: messages.VALIDATION.TASK_COMMENT_REQUIRED_FOR_NON_ADMIN });
  }

  return errors.length > 0 ? { error: { details: errors } } : { error: null, validatedData: data };
};

export { validateTask, validateTaskUpdate, validateTaskPatch };