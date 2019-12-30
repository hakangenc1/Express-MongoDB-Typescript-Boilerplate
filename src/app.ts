import express, { Application } from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth';

const app: Application = express();

//SETTINGS
app.set('port', 3000);

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

//ROUTES
app.use('/auth', authRoutes);

export default app;
