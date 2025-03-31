import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import database from './models/Database.js'
import Accounts from './models/Accounts.js';
import GeneralSensorsHistoric from './models/GeneralSensorsHistoric.js';
import GeneralSensors from './models/GeneralSensors.js';
import Users from './models/Users.js';
import Plots from './models/Plots.js';
import IndividualSensors from './models/IndividualSensors.js';
import authRoutes from './routes/auth.js';
import fakeApiRoutes from './routes/fakeApi.js'
import consumeApiRoutes from './routes/consumeApi.js'
import jwt from 'jsonwebtoken';
dotenv.config();
import { verifyOtp } from './controllers/auth.js';

const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const middlewareJWT = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token) return res.status(401).send({msg : 'No token provided'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).send({msg : 'Invalid token'});
        req.user = decoded;
        console.log('decoded', decoded);
        next();
    })
}
// routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/verify-jwt', middlewareJWT);

app.use(middlewareJWT);
app.use('/api', fakeApiRoutes);
app.use('/api', consumeApiRoutes)

const {
    API_PORT,
} = process.env;

// cliente => request => servidor => response

app.get('/', (request, response) => {
    response.send({
        message : 'Hola mundo'
    })
})

app.listen(parseInt(API_PORT), () => {
    console.log(`Server is running on port http://localhost:${API_PORT}`);
    const syncDatabase = async (callback) => {
        try {
            
            // Verifica que la base de datos esté conectada (comprueba que las credenciales sean correctas)
            await database.authenticate();
            console.log('Database successfully connected');

            // Sincroniza los modelos con la base de datos
            await database.sync({
                // force : true
                // alter : true
            });
            console.log('Database synced successfully');

            await Accounts.create({
                name : 'sensores',
                type : 'Enterprise'
            })
            callback();

        } catch (error) {
            console.log('Error connecting to database', error);
        }
    }
    syncDatabase(() => {
        console.log('Rutas: ');
        console.log(` User Register: http://localhost:${API_PORT}/api/auth/register`);
        console.log(` User Login: http://localhost:${API_PORT}/api/auth/login`);
        console.log(` Fake API: http://localhost:${API_PORT}/api/fake-api`);
        console.log(` Consume API: http://localhost:${API_PORT}/api/consume-api`);
    });

});


