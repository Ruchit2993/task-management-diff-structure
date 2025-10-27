import User from './user.model.js';
import bcrypt from 'bcrypt';

const getAllActiveUsers = async () => {
    return await User.findAll({
        attributes: [
            'id',
            'name',
            'email',
            'contact',
            'isAdmin',
            'isFirstLogin',
            'status',
            'createdAt',
            'updatedAt'
        ],
        where: { deleted: 0 },
    });
};

const findUserById = async (id) => {
    return await User.findOne({
        attributes: [
            'id',
            'name',
            'email',
            'contact',
            'isAdmin',
            'isFirstLogin',
            'status',
            'createdAt',
            'updatedAt'
        ],
        where: { id, deleted: 0 },
    });
};

export { getAllActiveUsers, findUserById };