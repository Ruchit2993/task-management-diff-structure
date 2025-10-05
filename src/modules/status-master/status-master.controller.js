import StatusMaster from './status-master.model.js';
import messages from '../../helper/constants/messages.js';
import ResponseBuilder from '../../helper/responce-builder/responseBuilder.js';
import { validateStatus, validateStatusUpdate, validateStatusPatch } from './statusValidation.js';

const getAllStatuses = async (req, res) => {
  try {
    const statuses = await StatusMaster.findAll({
      attributes: ['id', 'code', 'name', 'status', 'createdAt', 'updatedAt'],
      where: { deleted: 0 },
    });
    ResponseBuilder.success(res, 200, messages.SUCCESS.STATUS_RETRIEVED, { statuses });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getStatusByCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is provided
    if (!id) {
      return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, '"id" or "code" is required');
    }

    let status;

    // Check if the input is a number (for id) or a string (for code)
    if (!isNaN(id)) {
      // Numerical id
      status = await StatusMaster.findOne({ 
        attributes: ['id', 'code', 'name', 'status', 'createdAt', 'updatedAt'],
        where: { id: parseInt(id), deleted: 0 }
      });
    } else {
      // String code
      status = await StatusMaster.findOne({ 
        attributes: ['id', 'code', 'name', 'status', 'createdAt', 'updatedAt'],
        where: { code: id, deleted: 0 }
      });
    }

    if (!status) {
      return ResponseBuilder.error(res, 404, messages.ERROR.STATUS_NOT_FOUND);
    }

    ResponseBuilder.success(res, 200, messages.SUCCESS.STATUS_RETRIEVED, { status });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const createStatus = async (req, res) => {
  const { error } = validateStatus(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { code, name } = req.body;

  try {
    const existingStatus = await StatusMaster.findOne({ where: { code, deleted: 0 } });
    if (existingStatus) {
      return ResponseBuilder.error(res, 400, messages.ERROR.CODE_EXISTS);
    }

    const status = await StatusMaster.create({
      code,
      name,
      status: 1,
      createdBy: req.user.id,
      deleted: 0,
    });

    ResponseBuilder.success(res, 201, messages.SUCCESS.STATUS_CREATED, { status });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const updateStatus = async (req, res) => {
  const { code } = req.params;
  const { error } = validateStatusUpdate(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { code: newCode, name, status } = req.body;

  try {
    const existingStatus = await StatusMaster.findOne({ where: { code, deleted: 0 } });
    if (!existingStatus) {
      return ResponseBuilder.error(res, 404, messages.ERROR.STATUS_NOT_FOUND);
    }

    const updateData = {
      code: newCode,
      name,
      status: status !== undefined ? status : existingStatus.status,
      updatedBy: req.user.id,
    };

    await existingStatus.update(updateData);
    ResponseBuilder.success(res, 200, messages.SUCCESS.STATUS_UPDATED, { status: existingStatus });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const patchStatus = async (req, res) => {
  const { code } = req.params;
  const { error } = validateStatusPatch(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { code: newCode, name, status } = req.body;

  try {
    const existingStatus = await StatusMaster.findOne({ where: { code, deleted: 0 } });
    if (!existingStatus) {
      return ResponseBuilder.error(res, 404, messages.ERROR.STATUS_NOT_FOUND);
    }

    const updateData = { updatedBy: req.user.id };
    if (newCode) updateData.code = newCode;
    if (name) updateData.name = name;
    if (status !== undefined) updateData.status = status;

    await existingStatus.update(updateData);
    ResponseBuilder.success(res, 200, messages.SUCCESS.STATUS_UPDATED, { status: existingStatus });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const deleteStatus = async (req, res) => {
  const { code } = req.params;

  try {
    const status = await StatusMaster.findOne({ where: { code, deleted: 0 } });
    if (!status) {
      return ResponseBuilder.error(res, 404, messages.ERROR.STATUS_NOT_FOUND);
    }

    await status.update({
      status: 0,
      deleted: 1,
      deletedAt: new Date(),
      deletedBy: req.user.id,
    });
    ResponseBuilder.success(res, 200, messages.SUCCESS.STATUS_DELETED);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

export { getAllStatuses, getStatusByCode, createStatus, updateStatus, patchStatus, deleteStatus };