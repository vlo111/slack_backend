import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/sign-in', UsersController.signIn);

router.post('/sign-up', UsersController.signUp);

router.get('/oauth/v2/redirect/google', UsersController.redirectGoogle);

router.get('/current', UsersController.current);

export default router;
