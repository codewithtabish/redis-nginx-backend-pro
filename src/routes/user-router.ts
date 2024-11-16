import express from 'express';
import { getAllUsers, signup } from '../controller/user-controller';

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(signup);

export default userRouter;
