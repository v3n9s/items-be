import express from 'express';
import authRouter from './controllers/auth';
import { unauthorizedErrorHandler } from './middlewares/express-jwt';
import { validationErrorHandler } from './middlewares/validation';

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use(validationErrorHandler);
app.use(unauthorizedErrorHandler);

export default app;
