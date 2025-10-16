import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A task must have a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A task must have a description'],
        trim: true
    },
    dueDate: {
        type: Date,
        required: [true, 'A task must have a due date']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Task must belong to a user']
    }
}, {
    timestamps: true
});

// Add index for better query performance
taskSchema.index({ user: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;