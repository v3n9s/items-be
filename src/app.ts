import express from 'express';
import { validationErrorHandler } from './middlewares/validation';

const app = express();

app.use(express.json());
app.use(validationErrorHandler);

export default app;
