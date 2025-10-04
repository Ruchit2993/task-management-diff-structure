import User from './user.model.js';
import messages from '../../helper/constants/messages.js';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '../../helper/responce-builder/responseBuilder.js';
import { validateUser, validateUserUpdate, validateUserPatch } from './userValidation.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'contact', 'isAdmin', 'isFirstLogin', 'status', 'createdAt', 'updatedAt'],
      where: { deleted: 0 },
    });
    successResponse(res, 200, messages.SUCCESS.USER_RETRIEVED, { users });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email', 'contact', 'isAdmin', 'isFirstLogin', 'status', 'createdAt', 'updatedAt'],
      where: { id, deleted: 0 },
    });

    if (!user) {
      return errorResponse(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    successResponse(res, 200, messages.SUCCESS.USER_RETRIEVED, { user });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { error } = validateUserUpdate(req.body);
  if (error) {
    return errorResponse(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, email, contact, password } = req.body;

  try {
    const user = await User.findOne({ where: { id, deleted: 0 } });
    if (!user) {
      return errorResponse(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    const updateData = {
      name,
      email,
      contact: contact || null,
      updatedBy: req.user.id,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);
    successResponse(res, 200, messages.SUCCESS.USER_UPDATED, { user });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const patchUser = async (req, res) => {
  const { id } = req.params;
  const { error } = validateUserPatch(req.body);
  if (error) {
    return errorResponse(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, email, contact, password } = req.body;

  try {
    const user = await User.findOne({ where: { id, deleted: 0 } });
    if (!user) {
      return errorResponse(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    const updateData = { updatedBy: req.user.id };
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (contact) updateData.contact = contact;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await user.update(updateData);
    successResponse(res, 200, messages.SUCCESS.USER_UPDATED, { user });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id, deleted: 0 } });
    if (!user) {
      return errorResponse(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    await user.update({
      deleted: 1,
      deletedAt: new Date(),
      deletedBy: req.user.id,
    });
    successResponse(res, 200, messages.SUCCESS.USER_DELETED);
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

export { getAllUsers, getUserById, updateUser, patchUser, deleteUser };