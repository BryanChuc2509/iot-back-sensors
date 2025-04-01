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
                // console.log('existingPlotDb', existingPlotDb.toJSON())
                const changedData =
                    (console.log('Comparando nombre:', existingPlotDb.name, 'vs', plot.nombre), existingPlotDb.name !== plot.nombre) ||
                    (console.log('Comparando ubicación:', existingPlotDb.location, 'vs', plot.ubicacion), existingPlotDb.location !== plot.ubicacion) ||
                    (console.log('Comparando responsable:', existingPlotDb.responsible, 'vs', plot.responsable), existingPlotDb.responsible !== plot.responsable) ||
                    (console.log('Comparando tipo de cultivo:', existingPlotDb.crop_type, 'vs', plot.tipo_cultivo), existingPlotDb.crop_type !== plot.tipo_cultivo) ||
                    (console.log('Comparando último riego:', existingPlotDb.last_watering, 'vs', plot.ultimo_riego), existingPlotDb.last_watering !== plot.ultimo_riego) ||
                    (console.log('Comparando latitud:', existingPlotDb.latitude, 'vs', plot.latitud), existingPlotDb.latitude !== plot.latitud) ||
                    (console.log('Comparando longitud:', existingPlotDb.longitude, 'vs', plot.longitud), existingPlotDb.longitude !== plot.longitud);

                console.log('changedData:', changedData);


                if (changedData) {
                    await Plots.update({
                        name: plot.nombre,
                        location: plot.ubicacion,
                        responsible: plot.responsable,
                        crop_type: plot.tipo_cultivo,
                        last_watering: plot.ultimo_riego,
                        latitude: parseFloat(plot.latitud),
                        longitude: parseFloat(plot.longitud),
                    },
                        {
                            where: { id: existingPlotDb.id }
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

        const finalPlots = await Plots.findAll({
            where: { accountId: account.id },
            attributes : [
                'id',
                'name',
                'location',
                'responsible',
                'crop_type',
                'last_watering',
                'latitude',
                'longitude',
                'api_id',
                'deleted'
            ],
            include : {
                model : IndividualSensors,
            }
        });

        const data = finalPlots.map((plot) => {
            return {
                id: plot.id,
                name: plot.name,
                location: plot.location,
                responsible: plot.responsible,
                crop_type: plot.crop_type,
                last_watering: plot.last_watering,
                latitude: plot.latitude,
                longitude: plot.longitude,
                api_id: plot.api_id,
                deleted: plot.deleted,
                sensors: {
                    temperature: plot.IndividualSensor.temperature,
                    humidity: plot.IndividualSensor.humidity,
                    rainfall: plot.IndividualSensor.rainfall,
                    sunlight: plot.IndividualSensor.sunlight,
                    plotId: plot.IndividualSensor.plotId
                }
            }
        })

        // const finalSensorsForPlots = await IndividualSensors.findAll({
        //     where: {
        //         plotId: { [Op.in]: finalPlots.map(plot => plot.id) }
        //     }
        // });

        res.send({
            msg: 'Sincronización completada',
            sensores : {
                temperature : generalSensor.temperature,
                humidity : generalSensor.humidity,
                rainfall : generalSensor.rainfall,
                sunlight : generalSensor.sunlight
            },
            parcelas : data
            // plots: finalPlots,
            // sensors: finalSensorsForPlots
        });

    } catch (error) {
        console.error('Error al sincronizar los datos:', error);
        res.status(500).send({ msg: 'Error al sincronizar los datos', error: error.message });
    }
};

const getPlotsDeleted = async (req, res) => {
    try {
        let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        const response = await fetch('http://localhost:4001/api/consume-api', {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            credentials : 'include'
        });
        
        if (!response.ok) {
            return res.status(500).send({ msg: 'Error al consumir la API externa :&', error : response.statusText });
        }

        const account = await Accounts.findOne({
            where: { id: 1 },
            include: {
                model: Plots,
            }
        });

        if (!account) {
            return res.status(404).send({ msg: 'Cuenta no encontrada' });
        }

        const deletedPlots = account.Plots.filter(plot => plot.deleted === true);

        res.send({
            msg: 'Parcelas eliminadas encontradas',
            deletedPlots: deletedPlots
        });

    } catch (error) {
        console.error('Error en la función:', error.message);
        res.status(500).send({ msg: 'Error al obtener las parcelas eliminadas', error: error.message });
    }
}



export { syncData, getPlotsDeleted};
