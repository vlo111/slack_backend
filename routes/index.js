import express from 'express';
import users from './users';
import workspace from './workspace';

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.json({
      status: 'ok',
      test2: 'ok',
    });
  } catch (e) {
    next(e);
  }
});

router.use('/users', users);

router.use('/workspace', workspace);

export default router;