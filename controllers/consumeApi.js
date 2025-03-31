import Accounts from "../models/Accounts.js";
import GeneralSensors from "../models/GeneralSensors.js";
import Plots from "../models/Plots.js";
import IndividualSensors from "../models/IndividualSensors.js";
import { Op } from "sequelize";


const syncData = async (req, res) => {
    try {
        const apiRequest = await fetch('http://localhost:4001/api/fake-api');
        const apiData = await apiRequest.json();
        const { sensores: sensors, parcelas: plots } = apiData;

        const account = await Accounts.findOne({
            where: { id: 1 },
        });

        console.log('account', account.id)

        if (!account) {
            return res.status(404).send({ msg: 'Cuenta no encontrada' });
        }

        let generalSensor = await GeneralSensors.findOne({ where: { accountId: account.id } });

        if (!generalSensor) {
            generalSensor = await account.createGeneralSensor({
                temperature: sensors.temperatura,
                humidity: sensors.humedad,
                rainfall: sensors.lluvia,
                sunlight: sensors.sol,
            });
            console.log('Sensor general creado', generalSensor.dataValues);
        } else {
            await generalSensor.update({
                temperature: sensors.temperatura,
                humidity: sensors.humedad,
                rainfall: sensors.lluvia,
                sunlight: sensors.sol,
            });
            console.log('Sensor general actualizado', generalSensor.dataValues);
        }

        const dbPlots = await Plots.findAll({ where: { accountId: account.id } });

        for (const dbPlot of dbPlots) {
            const existingPlotInApi = plots.find(plot => plot.id === dbPlot.api_id);
            console.log('existingPlotInApi', existingPlotInApi)
            if (!existingPlotInApi) {
                // await dbPlot.update({ deleted: true });
                await Plots.update({
                    deleted: true,
                },
                {
                    where: { id: dbPlot.id }
                }
                )
                console.log(`Parcela eliminada de la base de datos: ${dbPlot.api_id}`);
            } else if (existingPlotInApi && dbPlot.deleted === true) {
                await Plots.update({
                    deleted: false,
                    name: existingPlotInApi.nombre,
                    location: existingPlotInApi.ubicacion,
                    responsible: existingPlotInApi.responsable,
                    crop_type: existingPlotInApi.tipo_cultivo,
                    last_watering: existingPlotInApi.ultimo_riego,
                    latitude: existingPlotInApi.latitud,
                    longitude: existingPlotInApi.longitud,
                }, 
                {
                    where: { id: dbPlot.id }
                }
            );
                console.log(`Parcela restaurada: ${dbPlot.api_id}`);
            }
        }

        for (const plot of plots) {
            const existingPlotDb = dbPlots.find(dbPlot => dbPlot.api_id === plot.id);

            if (!existingPlotDb) {
                const newPlot = await account.createPlot({
                    name: plot.nombre,
                    location: plot.ubicacion,
                    responsible: plot.responsable,
                    crop_type: plot.tipo_cultivo,
                    last_watering: plot.ultimo_riego,
                    latitude: plot.latitud,
                    longitude: plot.longitud,
                    api_id: plot.id,
                    deleted: plot.eliminado,
                    // accountId: 1,
                });

                await newPlot.createIndividualSensor({
                    temperature: plot.sensor.temperatura,
                    humidity: plot.sensor.humedad,
                    rainfall: plot.sensor.lluvia,
                    sunlight: plot.sensor.sol,
                });

                console.log(`Nueva parcela creada: ${newPlot.id}`);
            } else {
                const changedData =
                    existingPlotDb.name !== plot.nombre ||
                    existingPlotDb.location !== plot.ubicacion ||
                    existingPlotDb.responsible !== plot.responsable ||
                    existingPlotDb.crop_type !== plot.tipo_cultivo ||
                    existingPlotDb.last_watering !== plot.ultimo_riego ||
                    existingPlotDb.latitude !== plot.latitud ||
                    existingPlotDb.longitude !== plot.longitud;

                if (changedData) {
                    await IndividualSensors.update({
                        name: plot.nombre,
                        location: plot.ubicacion,
                        responsible: plot.responsable,
                        crop_type: plot.tipo_cultivo,
                        last_watering: plot.ultimo_riego,
                        latitude: plot.latitud,
                        longitude: plot.longitud,
                    },
                        {
                            where: { plotId: existingPlotDb.id }
                        }
                    );

                    console.log(`Parcela actualizada: ${existingPlotDb.id}`);
                }

                const individualSensor = await IndividualSensors.findOne({
                    where: { plotId: existingPlotDb.id },
                });

                if (individualSensor) {
                    await individualSensor.update({
                        temperature: plot.sensor.temperatura,
                        humidity: plot.sensor.humedad,
                        rainfall: plot.sensor.lluvia,
                        sunlight: plot.sensor.sol,
                    });
                    console.log(`Sensores de parcela actualizados: ${existingPlotDb.id}`);
                }
            }
        }

        const finalPlots = await Plots.findAll({ where: { accountId: account.id } });
        const finalSensorsForPlots = await IndividualSensors.findAll({ where: { plotId: { [Op.in]: finalPlots.map(plot => plot.id) } } });

        res.send({
            msg: 'Sincronización completada',
            plots: finalPlots,
            sensors: finalSensorsForPlots
        });

    } catch (error) {
        console.error('Error al sincronizar los datos:', error);
        res.status(500).send({ msg: 'Error al sincronizar los datos', error: error.message });
    }
};

export { syncData };
