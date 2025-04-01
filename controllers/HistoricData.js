import GeneralSensorsHistoric from "../models/GeneralSensorsHistoric.js";

const getHistoricDataGeneralSensor = async (req, res) => {
    try {

        const { limit } = req.params;
        console.log(limit)
        const limitInt = parseInt(limit);

        const historicData = await GeneralSensorsHistoric.findAll({
            where : {
                accountId : 1
            },
            limit : limitInt, 
            order : [
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json(historicData);

    } catch (error) {
        return res.status(500).json({
            msg : 'Error al obtener los datos históricos',
            error : error.message
        });
    }
}

export {
    getHistoricDataGeneralSensor
}