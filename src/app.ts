import express from 'express';
import authRouter from './controllers/auth';
import userRouter from './controllers/user';
import { unauthorizedErrorHandler } from './middlewares/express-jwt';
import { notFoundHandler } from './middlewares/not-found-handler';
import { validationErrorHandler } from './middlewares/validation';

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use(validationErrorHandler);
app.use(unauthorizedErrorHandler);
app.use(notFoundHandler);

export default app;
