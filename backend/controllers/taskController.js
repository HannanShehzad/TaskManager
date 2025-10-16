import Task from '../models/taskModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createTask = catchAsync(async (req, res, next) => {
    // Add user to task
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            task
        }
    });
});

export const getAllTasks = catchAsync(async (req, res, next) => {
    const filter = { user: req.user.id };
    
    // Add status filter if provided
    if (req.query.status) {
        filter.status = req.query.status;
    }

    const tasks = await Task.find(filter);

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: {
            tasks
        }
    });
});

export const getTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });
});

export const updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user.id
        },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });
});

export const deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});