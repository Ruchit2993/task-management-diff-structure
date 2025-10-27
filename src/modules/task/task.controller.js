import Task from './task.model.js';
import StatusMaster from '../status-master/status-master.model.js';
import TeamMember from '../team-member/team-member.model.js';
import User from '../user/user.model.js';
import Comment from '../comments/comments.model.js';
import { sequelize } from '../../config/dbConnect.js';
import messages from '../../helper/constants/messages.js';
import ResponseBuilder from '../../helper/responce-builder/responseBuilder.js';
import { validateTask, validateTaskUpdate, validateTaskPatch } from './taskValidation.js';
import { getAllActiveTasks, getTaskByIdWithStatus, getTasksByStatusCode, isValidStatus, createNewTask, updateExistingTask, addTaskComment, softDeleteTaskById } from './task.util.js';

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { deleted: 0 };
    if (status) where.status = status;

    // const tasks = await Task.findAll({
    //   attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
    //   where,
    //   include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    // });
    const tasks = await getAllActiveTasks(req.query.status)
    ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_RETRIEVED, { tasks });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getTasksByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    // const tasks = await Task.findAll({
    //   attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
    //   where: { status, deleted: 0 },
    //   include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    // });
    const tasks = await getTasksByStatusCode(req.params.status);
    if (tasks.length === 0) {
      return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }
    ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_RETRIEVED, { tasks });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    // const task = await Task.findOne({
    //   attributes: ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'],
    //   where: { id, deleted: 0 },
    //   include: [{ model: StatusMaster, attributes: ['code', 'name'], where: { deleted: 0 } }],
    // });
    const task = await getTaskByIdWithStatus(req.params.id);
    if (!task) {
      return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }
    ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_RETRIEVED, { task });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const createTask = async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  try {
    const { name, description, due_date, status, teamMembers } = req.body;
    const taskStatus = status || 'TO_DO';
    // const statusExists = await StatusMaster.findOne({ where: { code: taskStatus, deleted: 0 } });
    const statusExists = await isValidStatus(taskStatus);
    if (!statusExists) {
      return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_STATUS);
    }

    if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
      const users = await User.findAll({
        where: { id: teamMembers, deleted: 0 },
      });
      if (users.length !== teamMembers.length) {
        return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_TEAM_MEMBERS);
      }
    }

    // const task = await sequelize.transaction(async (t) => {
    //   const newTask = await Task.create(
    //     {
    //       name,
    //       description,
    //       status: taskStatus,
    //       dueDate: due_date,
    //       createdBy: req.user.id,
    //       deleted: 0,
    //     },
    //     { transaction: t }
    //   );

    //   if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
    //     const teamMemberData = teamMembers.map((userId) => ({
    //       userId,
    //       taskId: newTask.id,
    //       createdBy: req.user.id,
    //       deleted: 0,
    //     }));
    //     await TeamMember.bulkCreate(teamMemberData, { transaction: t });
    //   }

    //   return newTask;
    // });
    const task = await createNewTask({ name, description, status: taskStatus, due_date }, teamMembers, req.user.id);

    ResponseBuilder.success(res, 201, messages.SUCCESS.TASK_CREATED, { task });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const updateTask = async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  try {
    const { id } = req.params;
    const { name, description, status, due_date } = req.body;
    // const task = await Task.findOne({ where: { id, deleted: 0 } });
    // if (!task) {
    //   return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    // }

    // if (status) {
    //   const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
    //   if (!statusExists) {
    //     return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_STATUS);
    //   }
    // }
    if (status && !(await isValidStatus(status))) {
      return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_STATUS);
    }

    // const updateData = {
    //   name,
    //   description: description || null,
    //   status: status || task.status,
    //   dueDate: due_date || task.dueDate,
    //   updatedBy: req.user.id,
    // };
    const updateData = {
      name,
      description: description || null,
      status,
      dueDate: due_date,
      updatedBy: req.user.id,
    };

    const task = await updateExistingTask(id, updateData);
    if (!task)
      return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_UPDATED, { task });
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const patchTask = async (req, res) => {
  const { id } = req.params;
  const { error } = validateTaskPatch(req.body, req.user.isAdmin);
  if (error) {
    return ResponseBuilder.error(res, 400, messages.ERROR.VALIDATION_ERROR, error.details[0].message);
  }

  const { name, description, status, due_date, comment } = req.body;

  try {
    const task = await Task.findOne({ where: { id, deleted: 0 } });
    if (!task) {
      return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }

    if (req.user.isAdmin) {
      if (comment) {
        return ResponseBuilder.error(res, 400, messages.ERROR.ADMIN_COMMENT_NOT_ALLOWED);
      }

      if (status) {
        const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
        if (!statusExists) {
          return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_STATUS);
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

      ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_UPDATED, { task });
    } else {
      // Non-admin: Allow status and/or comment, but comment is required if status is provided
      if (name || description !== undefined || due_date) {
        return ResponseBuilder.error(res, 400, messages.ERROR.NON_ADMIN_TASK_FIELDS_NOT_ALLOWED);
      }

      if (status && !comment) {
        return ResponseBuilder.error(res, 400, messages.ERROR.COMMENT_REQUIRED_FOR_STATUS, 'Comment is required when updating status for non-admin users');
      }

      const updates = [];
      if (status) {
        const statusExists = await StatusMaster.findOne({ where: { code: status, deleted: 0 } });
        if (!statusExists) {
          return ResponseBuilder.error(res, 400, messages.ERROR.INVALID_STATUS);
        }
        await task.update({ status, updatedBy: req.user.id });
        updates.push('status');
      }

      if (comment) {
        await addTaskComment(id, req.user.id, comment);
        updates.push('comment');
      }

      ResponseBuilder.success(res, 200, updates.includes('status') ? messages.SUCCESS.TASK_UPDATED : messages.SUCCESS.COMMENT_ADDED, { task });
    }
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, deleted: 0 } });
    if (!task) {
      return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    }

    const deleted = await softDeleteTaskById(id, req.user.id);
    if (!deleted) return ResponseBuilder.error(res, 404, messages.ERROR.TASK_NOT_FOUND);
    ResponseBuilder.success(res, 200, messages.SUCCESS.TASK_DELETED);
  } catch (error) {
    ResponseBuilder.error(res, 500, messages.ERROR.SERVER_ERROR, error.message);
  }
};

export { getAllTasks, getTasksByStatus, getTaskById, createTask, updateTask, patchTask, deleteTask };