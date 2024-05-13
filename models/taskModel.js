const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const taskSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskAssignees: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'In Progress', 'Pending', 'In Review', 'Failed'], default: null },
    taskAssignedDate: { type: Date, default: Date.now },
    taskDueDate: { type: Date, required: true }
})

taskSchema.plugin(mongoosePaginate);
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;