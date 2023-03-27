import { Router } from 'express';
import API from '@src/constants/api';

import adminMw from './middleware/adminMw';
// import Paths from './constants/Paths';
// import User from '@src/models/User';
import authRouter from './auth';
import categoryRouter from './category';

// **** Variables **** //

const apiRouter = Router();

// **** Setup **** //

// const authRouter = Router();

// // Login user
// authRouter.post(
//   Paths.Auth.Login,
//   validate('email', 'password'),
//   AuthRoutes.login,
// );

// // Logout user
// authRouter.get(
//   Paths.Auth.Logout,
//   AuthRoutes.logout,
// );

// Add AuthRouter
apiRouter.use(API.AUTH.BASE, authRouter);
apiRouter.use(API.CATEGORY.BASE, categoryRouter);

// ** Add UserRouter ** //

// const userRouter = Router();

// // Get all users
// userRouter.get(
//   Paths.Users.Get,
//   UserRoutes.getAll,
// );

// // Add one user
// userRouter.post(
//   Paths.Users.Add,
//   validate(['user', User.isUser]),
//   UserRoutes.add,
// );

// // Update one user
// userRouter.put(
//   Paths.Users.Update,
//   validate(['user', User.isUser]),
//   UserRoutes.update,
// );

// // Delete one user
// userRouter.delete(
//   Paths.Users.Delete,
//   validate(['id', 'number', 'params']),
//   UserRoutes.delete,
// );

// // Add UserRouter
// apiRouter.use(Paths.Users.Base, adminMw, userRouter);

// **** Export default **** //

export default apiRouter;
