import 'dotenv/config';
// import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import messages from '../helper/constants/messages.js';
// dotenv.config();

const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USERNAME, process.env.DB_PASSWWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log(messages.SUCCESS.DB_CONN_SUCCESS);
    } catch (error) {
        console.error(messages.ERROR.DB_CONN_ERR, error);
    }
}

export { sequelize, testConnection };