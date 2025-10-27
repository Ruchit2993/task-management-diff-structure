import User from '../user/user.model.js';
import messages from '../../helper/constants/messages.js';
import ResponseBuilder from '../../helper/responce-builder/responseBuilder.js';
import { validateRegister, validateLogin, validateChangePassword, validateFirstChangePassword, validateForgotPassword, validateResetPassword } from './authValidation.js';
import { generateToken, hashPassword, comparePassword } from './auth.util.js';

const register = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, email, contact, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email, deleted: 0 } });
    if (existingUser) {
      return ResponseBuilder.error(res, 400, messages.ERROR.EMAIL_EXISTS);
    }

    const existingContact = contact ? await User.findOne({ where: { contact, deleted: 0 } }) : null;
    if (existingContact) {
      return ResponseBuilder.error(res, 400, messages.ERROR.CONTACT_EXISTS);
    }

    const hashedPassword = await hashPassword(password);
    const userCount = await User.count({ where: { deleted: 0 } });
    const isAdmin = userCount === 0 ? 1 : 0;

    await User.create({
      name,
      email,
      contact,
      password: hashedPassword,
      isFirstLogin: 1,
      isAdmin,
      status: 1,
      deleted: 0,
    });

    ResponseBuilder.success(res, 201, messages.SUCCESS.USER_REGISTERED);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, deleted: 0 } });
    if (!user) {
      return ResponseBuilder.error(res, 401, messages.ERROR.INVALID_EM_PASS);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return ResponseBuilder.error(res, 401, messages.ERROR.INVALID_EM_PASS);
    }

    const token = generateToken(user);

    ResponseBuilder.success(res, 200, messages.SUCCESS.LOGIN_SUCCESS, { token, isFirstLogin: user.isFirstLogin });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const changePassword = async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { email, newPassword } = req.body;

  try {
    // Ensure the email matches the authenticated user's email
    if (email !== req.user.email) {
      return ResponseBuilder.error(res, 403, messages.ERROR.UNAUTHORIZED);
    }

    // Find the user
    const user = await User.findOne({ where: { email, deleted: 0 } });
    if (!user) {
      return ResponseBuilder.error(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await user.update({
      password: hashedPassword,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    ResponseBuilder.success(res, 200, messages.SUCCESS.PASSWORD_CHANGED);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};


const firstChangePassword = async (req, res) => {
  const { error } = validateFirstChangePassword(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { id: req.user.id, deleted: 0 } });
    if (!user) {
      return ResponseBuilder.error(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    if (!user.isFirstLogin) {
      return ResponseBuilder.error(res, 400, messages.ERROR.NOT_FIRST_LOGIN);
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({
      password: hashedPassword,
      isFirstLogin: 0,
      updatedAt: new Date(),
      updatedBy: req.user.id,
    });

    ResponseBuilder.success(res, 200, messages.SUCCESS.PASSWORD_CHANGED);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const forgotPassword = async (req, res) => {
  const { error } = validateForgotPassword(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email, deleted: 0 } });
    if (!user) {
      return ResponseBuilder.error(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    const token = generateToken(user);

    ResponseBuilder.success(res, 200, messages.ERROR.REDIRECT_CHANGE_PASS, { token });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const resetPassword = async (req, res) => {
  const { error } = validateResetPassword(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email, deleted: 0 } });
    if (!user) {
      return ResponseBuilder.error(res, 404, messages.ERROR.USER_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({
      password: hashedPassword,
      isFirstLogin: 0,
      updatedAt: new Date(),
    });

    ResponseBuilder.success(res, 200, messages.SUCCESS.PASSWORD_RESET);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

export { register, login, changePassword, firstChangePassword, forgotPassword, resetPassword };