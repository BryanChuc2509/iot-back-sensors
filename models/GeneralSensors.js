import { DataTypes, Sequelize } from "sequelize";
import database from "./Database.js";
import GeneralSensorsHistoric from "./GeneralSensorsHistoric.js";

const GeneralSensors = database.define('GeneralSensors',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
            type: DataTypes.DECIMAL(4, 2),
            allowNull : false,
        }, 
        createdAt : {
            type : DataTypes.DATE,
            allowNull : false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt : {
            type : DataTypes.DATE,
            allowNull : false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName : 'general_sensors',
        timestamps : false,
    }
)

GeneralSensors.afterUpdate(async (instance, options) => {
    try {
        await GeneralSensorsHistoric.create({
            accountId: 1, 
            humidity: instance.humidity,
            temperature: instance.temperature,
            rainfall: instance.rainfall,
            sunlight: instance.sunlight
        });
    } catch (error) {
        console.error('Error al guardar el histórico:', error);
    }
});


export default GeneralSensors;