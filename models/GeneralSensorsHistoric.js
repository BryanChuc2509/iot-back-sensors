import { DataTypes } from "sequelize";
import database from "./Database.js";

const GeneralSensorsHistoric = database.define('GeneralSensorsHistoric',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accountId : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        humidity: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
        },
        temperature: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
        },
        rainfall: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
        },
        sunlight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull : false,
        },
        createdAt : {
            type : DataTypes.DATE,
            allowNull : false,
            defaultValue : DataTypes.NOW
        }
    },
    {
        tableName : 'general_sensors_historic',
        timestamps : false
    }
)

export default GeneralSensorsHistoric;