import dotenv from 'dotenv';
import express from 'express';
import { sequelize, testConnection } from '../config/dbConnect.js';
import requestLogger from "../helper/middlewares/request.logger.js"
import router from '../route/route.js';

dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(express.json())
app.use('/',requestLogger, router);

testConnection();

// await sequelize.sync({force: true}); 
await sequelize.sync({alter: true}); 

console.log(process.env.JWT_SECRET)


app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`);
});
