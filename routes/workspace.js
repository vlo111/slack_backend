import express from 'express';
import WorkspaceController from '../controllers/WorkspaceController';

const router = express.Router();

router.post('/create', WorkspaceController.create);

router.get('/getAll/:userId', WorkspaceController.getAllWorkspaces);


export default router;
