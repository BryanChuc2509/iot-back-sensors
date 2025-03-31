
import { DataTypes } from "sequelize";
import database from "./Database.js";
import IndividualSensors from "./IndividualSensors.js";

const Plots = database.define('Plots',
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
        location : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        responsible : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        crop_type : {
            type : DataTypes.STRING,
            allowNull : false
        }, 
        last_watering : {
            type : DataTypes.DATE,
            allowNull : false,
        }, 
        latitude : {
            type : DataTypes.DECIMAL(10, 8),
            allowNull : false,
        },
        longitude : {
            type : DataTypes.DECIMAL(10, 8),
            allowNull : false,
        },
        api_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        deleted : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false,
        }
        
    },
    {
        tableName : 'plots',
        timestamps : true,
    }
)

Plots.hasOne(IndividualSensors),
IndividualSensors.belongsTo(Plots)

export default Plots;