import express from 'express';
import cors from 'cors';
import authRouter from './controllers/auth';
import collectionRouter from './controllers/collection';
import commentRouter from './controllers/comment';
import itemRouter from './controllers/item';
import likeRouter from './controllers/like';
import userRouter from './controllers/user';
import errorHandler from './middlewares/error-handler';
import { unauthorizedErrorHandler } from './middlewares/express-jwt';
import { notFoundHandler } from './middlewares/not-found-handler';
import { validationErrorHandler } from './middlewares/validation';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/collections', collectionRouter);
app.use('/items', itemRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);
app.use(validationErrorHandler);
app.use(unauthorizedErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
