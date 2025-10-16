import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createTask);

router
    .route('/:id')
    .get(taskController.getTask)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

export default router;