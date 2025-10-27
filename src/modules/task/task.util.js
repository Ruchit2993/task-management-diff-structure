import { sequelize } from '../../config/dbConnect.js';
import Task from './task.model.js';
import StatusMaster from '../status-master/status-master.model.js';
import TeamMember from '../team-member/team-member.model.js';
import User from '../user/user.model.js';
import Comment from '../comments/comments.model.js';

const TASK_ATTRIBUTES = ['id', 'name', 'description', 'status', 'dueDate', 'createdAt', 'updatedAt'];

const STATUS_INCLUDE = {
  model: StatusMaster,
  attributes: ['code', 'name'],
  where: { deleted: 0 },
};

const getAllActiveTasks = async (status) => {
  const where = { deleted: 0 };
  if (status) where.status = status;

  return await Task.findAll({
    attributes: TASK_ATTRIBUTES,
    where,
    include: [STATUS_INCLUDE],
  });
};

const getTasksByStatusCode = async (status) => {
  return await Task.findAll({
    attributes: TASK_ATTRIBUTES,
    where: { status, deleted: 0 },
    include: [STATUS_INCLUDE],
  });
};

const getTaskByIdWithStatus = async (id) => {
  return await Task.findOne({
    attributes: TASK_ATTRIBUTES,
    where: { id, deleted: 0 },
    include: [STATUS_INCLUDE],
  });
};

const isValidStatus = async (code) => {
  const status = await StatusMaster.findOne({ where: { code, deleted: 0 } });
  return !!status;
};

const createNewTask = async (taskData, teamMembers, createdBy) => {
  return await sequelize.transaction(async (t) => {
    const newTask = await Task.create(
      {
        name: taskData.name,
        description: taskData.description,
        status: taskData.status,
        dueDate: taskData.due_date,
        createdBy,
        deleted: 0,
      },
      { transaction: t }
    );

    if (teamMembers?.length) {
      const teamMemberData = teamMembers.map((userId) => ({
        userId,
        taskId: newTask.id,
        createdBy,
        deleted: 0,
      }));
      await TeamMember.bulkCreate(teamMemberData, { transaction: t });
    }

    return newTask;
  });
};

const updateExistingTask = async (id, updateData) => {
  const task = await Task.findOne({ where: { id, deleted: 0 } });
  if (!task) return null;
  await task.update(updateData);
  return task;
};

const addTaskComment = async (taskId, userId, comment) => {
  return await Comment.create({
    userId,
    taskId,
    comment,
    createdBy: userId,
    deleted: 0,
  });
};

const softDeleteTaskById = async (id, deletedBy) => {
  const task = await Task.findOne({ where: { id, deleted: 0 } });
  if (!task) return null;
  await task.update({
    deleted: 1,
    deletedAt: new Date(),
    deletedBy,
  });
  return task;
};

export { getTasksByStatusCode, getAllActiveTasks, getTaskByIdWithStatus, isValidStatus, createNewTask, updateExistingTask, addTaskComment };
