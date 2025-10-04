import Task from './task.model.js';
import StatusMaster from '../status-master/status-master.model.js';
import TeamMember from '../team-member/team-member.model.js';
import User from '../user/user.model.js';
import Comment from '../comments/comments.model.js';
import { sequelize } from '../../config/dbConnect.js';
import messages from '../../helper/constants/messages.js';
import { successResponse, errorResponse } from '../../helper/responce-builder/responseBuilder.js';
import { validateTask, validateTaskUpdate, validateTaskPatch } from './taskValidation.js';

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { deleted: 0 };
    if (status) where.status = status;

    const tasks = await Task.findAll({
      attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
      where,
      include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    });
    successResponse(res, 200, messages.SUCCESS.TASK_RETRIEVED, { tasks });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getTasksByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const tasks = await Task.findAll({
      attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
      where: { status, deleted: 0 },
      include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    });
    if (tasks.length === 0) {
      return errorResponse(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }
    successResponse(res, 200, messages.SUCCESS.TASK_RETRIEVED, { tasks });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
      where: { id, deleted: 0 },
      include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    });
    if (!task) {
      return errorResponse(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }
    successResponse(res, 200, messages.SUCCESS.TASK_RETRIEVED, { task });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const createTask = async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) {
    return errorResponse(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, description, due_date, status, teamMembers } = req.body;

  try {
    const taskStatus = status || 'TO_DO';
    const statusExists = await StatusMaster.findOne({ where: { code: taskStatus, deleted: 0 } });
    if (!statusExists) {
      return errorResponse(res, 400, messages.ERROR.INVALID_STATUS, `Status '${taskStatus}' does not exist. Available statuses: ${await StatusMaster.findAll({ attributes: ['code'], where: { deleted: 0 } }).then(statuses => statuses.map(s => s.code).join(', '))}`);
    }

    if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
      const users = await User.findAll({
        where: { id: teamMembers, deleted: 0 },
      });
      if (users.length !== teamMembers.length) {
        return errorResponse(res, 400, messages.ERROR.INVALID_TEAM_MEMBERS);
      }
    }

    const task = await sequelize.transaction(async (t) => {
      const newTask = await Task.create(
        {
          name,
          description,
          status: taskStatus,
          dueDate: due_date,
          createdBy: req.user.id,
          deleted: 0,
        },
        { transaction: t }
      );

      if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
        const teamMemberData = teamMembers.map((userId) => ({
          userId,
          taskId: newTask.id,
          createdBy: req.user.id,
          deleted: 0,
        }));
        await TeamMember.bulkCreate(teamMemberData, { transaction: t });
      }

      return newTask;
    });

    successResponse(res, 201, messages.SUCCESS.TASK_CREATED, { task });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { error } = validateTaskUpdate(req.body);
  if (error) {
    return errorResponse(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, description, status, due_date } = req.body;

  try {
    const task = await Task.findOne({ where: { id, deleted: 0 } });
    if (!task) {
      return errorResponse(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }

    if (status) {
      const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
      if (!statusExists) {
        return errorResponse(res, 400, messages.ERROR.INVALID_STATUS);
      }
    }

    const updateData = {
      name,
      description: description || null,
      status: status || task.status,
      dueDate: due_date || task.dueDate,
      updatedBy: req.user.id,
    };

    await task.update(updateData);
    successResponse(res, 200, messages.SUCCESS.TASK_UPDATED, { task });
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const patchTask = async (req, res) => {
  const { id } = req.params;
  const { error } = validateTaskPatch(req.body, req.user.isAdmin);
  if (error) {
    return errorResponse(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, description, status, due_date, comment } = req.body;

  try {
    const task = await Task.findOne({ where: { id, deleted: 0 } });
    if (!task) {
      return errorResponse(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }

    if (req.user.isAdmin) {
      if (comment) {
        return errorResponse(res, 400, messages.ERROR.ADMIN_COMMENT_NOT_ALLOWED);
      }

      if (status) {
        const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
        if (!statusExists) {
          return errorResponse(res, 400, messages.ERROR.INVALID_STATUS, `Status '${status}' does not exist. Available statuses: ${await StatusMaster.findAll({ attributes: ['code'], where: { deleted: 0 } }).then(statuses => statuses.map(s => s.code).join(', '))}`);
        }
      }

      const updateData = { updatedBy: req.user.id };
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (status) updateData.status = status;
      if (due_date) updateData.dueDate = due_date;

      if (Object.keys(updateData).length > 1) {
        await task.update(updateData);
      }

      successResponse(res, 200, messages.SUCCESS.TASK_UPDATED, { task });
    } else {
      // Non-admin: Allow status and/or comment, but comment is required if status is provided
      if (name || description !== undefined || due_date) {
        return errorResponse(res, 400, messages.ERROR.NON_ADMIN_TASK_FIELDS_NOT_ALLOWED);
      }

      if (status && !comment) {
        return errorResponse(res, 400, messages.ERROR.COMMENT_REQUIRED_FOR_STATUS, 'Comment is required when updating status for non-admin users');
      }

      const updates = [];
      if (status) {
        const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
        if (!statusExists) {
          return errorResponse(res, 400, messages.ERROR.INVALID_STATUS, `Status '${status}' does not exist. Available statuses: ${await StatusMaster.findAll({ attributes: ['code'], where: { deleted: 0 } }).then(statuses => statuses.map(s => s.code).join(', '))}`);
        }
        await task.update({ status, updatedBy: req.user.id });
        updates.push('status');
      }

      if (comment) {
        await Comment.create({
          userId: req.user.id,
          taskId: id,
          comment,
          createdBy: req.user.id,
          deleted: 0,
        });
        updates.push('comment');
      }

      successResponse(res, 200, updates.includes('status') ? messages.SUCCESS.TASK_UPDATED : messages.SUCCESS.COMMENT_ADDED, { task });
    }
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, deleted: 0 } });
    if (!task) {
      return errorResponse(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }

    await task.update({
      deleted: 1,
      deletedAt: new Date(),
      deletedBy: req.user.id,
    });
    successResponse(res, 200, messages.SUCCESS.TASK_DELETED);
  } catch (error) {
    errorResponse(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

export { getAllTasks, getTasksByStatus, getTaskById, createTask, updateTask, patchTask, deleteTask };