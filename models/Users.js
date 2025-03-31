import { DataTypes } from "sequelize";
import database from "./Database.js";;

const Users = database.define('Users',
    {
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true,
        },
        role : {
            type : DataTypes.ENUM('Admin', 'User'),
            allowNull : false,
            defaultValue : 'User'
        },
        otp : {
            type : DataTypes.STRING,
            allowNull : true,
        }, 
        changedPassword : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        }
    },

    {
        tableName : 'users',
        timestamps : true,
        indexes : [
            {
                unique : true,
                fields : ['email']
            }
        ]
    }

)

export default Users;