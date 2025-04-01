import { DataTypes } from "sequelize";
import database from "./Database.js";

const IndividualSensors = database.define('IndividualSensors',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        humidity : {
            type : DataTypes.DECIMAL(4, 2),
            allowNull : false,
        },
        temperature : {
            type : DataTypes.DECIMAL(4, 2),
            allowNull : false,
        },
        rainfall : {
            type : DataTypes.DECIMAL(4,2),
            allowNull : false,
        },
        sunlight : {
            type : DataTypes.DECIMAL(6,2),
            allowNull : false,
        }

    },
    {
        tableName : 'individual_sensors',
        timestamps : true,
    }

)

export default IndividualSensors;
