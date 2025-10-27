import StatusMaster from './status-master.model.js';

const STATUS_ATTRIBUTES = ['id', 'code', 'name', 'status', 'createdAt', 'updatedAt', 'deleted', 'createdBy', 'updatedBy'];

const getAllActiveStatuses = async () => {
    return await StatusMaster.findAll({
        attributes: STATUS_ATTRIBUTES,
        where: { deleted: 0 },
    });
};

const findStatusByIdOrCode = async (idOrCode) => {
  const where = { deleted: 0 };
  if (!isNaN(idOrCode)) {
    where.id = parseInt(idOrCode);
  } else {
    where.code = idOrCode;
  }

  return await StatusMaster.findOne({
    attributes: STATUS_ATTRIBUTES,
    where,
  });
};

const statusDbIns = async (code, name, createdBy) => {
  return await StatusMaster.create({
    code,
    name,
    status: 1,
    createdBy,
    deleted: 0,
  });
};


export { getAllActiveStatuses, findStatusByIdOrCode, statusDbIns };