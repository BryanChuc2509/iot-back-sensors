import database from "./Database.js";
import sequelize, { DataTypes } from 'sequelize'
import Users from "./Users.js";
import GeneralSensors from "./GeneralSensors.js"
import Plots from "./Plots.js";

const Accounts = database.define('Accounts', 
    {
        // campos de la tablas
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        type : {
            type : DataTypes.ENUM('Enterprise', 'Personal'),
            allowNull : false,
            defaultValue : 'Personal'
        }
    },
    {
        tableName : 'accounts',
        timestamps : true,
        // configuraciones de la tabla
    }
)

// Relations 
Accounts.hasMany(Users)
Users.belongsTo(Accounts)

Accounts.hasOne(GeneralSensors)
GeneralSensors.belongsTo(Accounts)

Accounts.hasMany(Plots)
Plots.belongsTo(Accounts)

export default Accounts;