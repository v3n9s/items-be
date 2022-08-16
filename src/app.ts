import express from 'express';
import { unauthorizedErrorHandler } from './middlewares/express-jwt';
import { validationErrorHandler } from './middlewares/validation';

const app = express();

app.use(express.json());
app.use(validationErrorHandler);
app.use(unauthorizedErrorHandler);

export default app;
