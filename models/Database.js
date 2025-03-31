import Sequelize from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

const {
    DB_HOST, 
    DB_USER,
    DB_NAME,
    DB_PASSWORD,
    DB_DIALECT,
} = process.env

const database = new Sequelize({
    dialect : DB_DIALECT,
    host : DB_HOST,
    username : DB_USER,
    password : DB_PASSWORD,
    database : DB_NAME,
    logging : false
}); 

export default database;