// Importaciones de rutas
import authRoutes from './routes/Auth.js';
import roleRoutes from './routes/Roles.js';
import categoryRoutes from './routes/Categories.js';
import menuRoutes from './routes/Menu.js';
import tableRoutes from './routes/Tables.js';
import reservationRoutes from './routes/Reservations.js';

// Importaciones de dependencias 
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.js';
import loadEnv from './utils/loadEnv.js';
import cookieParser from 'cookie-parser';
import loadStaticFiles from './utils/loadStaticsFiles.js'

// Middlewares
const app = express();

app.use(express.json());
app.use(cookieParser());

// Cargar variables de entorno
loadEnv();

// Validar entorno (Desarrollo o Produccion)
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    console.log('Modo de desarrollo')

    app.use(logger);
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    }));
} else {
    console.log('Modo de produccion')
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

// Testeo de api
app.get('/api/ping', async (req, res) => {
    res.send('Pong')
});

// Servir archivos estaticos de la build de Vite
if (isProduction) loadStaticFiles(app);

// Prender servidor de solicitudes http 
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));