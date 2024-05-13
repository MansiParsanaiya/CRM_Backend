const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// exports.addTask = async (req, res) => {
//     try {
//         const { taskDescription, taskDueDate, taskAssignedDate } = req.body;

//         if (!taskDescription) {
//             return res.status(400).json({ message: 'Task Description is required & must be greater than 3 letters' });
//         }

//         const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

//         if (taskDueDate && !dateFormatRegex.test(taskDueDate)) {
//             return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.' });
//         }

//         const assignedDate = new Date();
//         const dueDate = new Date(taskDueDate);
//         const taskAssignDate = new Date(taskAssignedDate);

//         console.log(assignedDate, "/", dueDate)

//         let newAssign = assignedDate.toISOString().split('T')[0];
//         let newDue = dueDate.toISOString().split('T')[0];

//         let status;
//         if (newAssign >= newDue) {
//             status = 'Pending';
//         } else if (taskAssignDate < dueDate) {
//             status = 'In Progress';
//         } else {
//             status = null;
//         }

//         const taskData = { ...req.body, status };

//         const task = await Task.create(taskData);
//         res.status(201).json({ message: 'Task Created !', data: task });

//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

exports.addTask = async (req, res) => {
    try {
        const { projectId, taskDescription, taskDueDate, taskAssignedDate } = req.body;

        if (!projectId || !taskDescription || taskDescription.length < 3 || !taskDueDate) {
            return res.status(400).json({ error: 'Missing or invalid input data' });
        }

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormatRegex.test(taskDueDate)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const assignedDate = new Date(taskAssignedDate);
        const dueDate = new Date(taskDueDate);

        if (assignedDate < startDate || assignedDate > endDate || dueDate < startDate || dueDate > endDate) {
            return res.status(400).json({ message: 'Task dates must fall within project start and end dates' });
        }

        // let status;
        // if (assignedDate >= dueDate) {
        //     status = 'Pending';
        // } else if (assignedDate < dueDate) {
        //     status = 'In Progress';
        // } else {
        //     status = null;
        // }

        const taskData = { ...req.body };

        const task = await Task.create(taskData);
        res.status(201).json({ error: 'Task Created!', data: task });

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { projectName: { $regex: new RegExp(search, 'i') } },
                { taskDescription: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const tasks = await Task.paginate(query, options);

        const tasksWithTimeRemaining = tasks.docs.map(task => {

            const currentDate = new Date();
            // console.log(currentDate)
            const timeRemainingMillis = task.taskDueDate - currentDate.getTime();

            const days = Math.floor(timeRemainingMillis / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemainingMillis % (1000 * 60 * 60)) / (1000 * 60));

            return {
                ...task.toJSON(),
                timeRemaining: { days, hours, minutes }
            };
        });

        if (tasks.docs.length) {
            res.status(200).json({ ...tasks, docs: tasksWithTimeRemaining });
        }
        else {
            return res.status(404).json({ docs: [], message: 'No tasks found for provided criteria.' });
        }


    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getTaskByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const { page, limit, search } = req.query;

        const query = { projectId: projectId };
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        if (search) {
            query.$or = [
                { taskDescription: { $regex: new RegExp(search, 'i') } },
                { taskAssignees: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const tasks = await Task.paginate(query, options);

        const tasksWithTimeRemaining = tasks.docs.map(task => {

            const currentDate = new Date();
            console.log(currentDate)
            const timeRemainingMillis = task.taskDueDate - currentDate.getTime();

            const days = Math.floor(timeRemainingMillis / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemainingMillis % (1000 * 60 * 60)) / (1000 * 60));

            return {
                ...task.toJSON(),
                timeRemaining: { days, hours, minutes }
            };
        });

        console.log(tasks)
        if (tasks.docs) {
            res.status(200).json({ ...tasks, docs: tasksWithTimeRemaining });
        }
        else {
            return res.status(404).json({ docs: [], message: 'No tasks found for provided criteria.' });
        }

        // res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// exports.updateTask = async (req, res) => {
//     try {
//         const { id } = req.params; // assuming id is passed as a route parameter
//         const { taskAssignedDate, taskDueDate } = req.body;

//         if (!id || !taskAssignedDate || !taskDueDate) {
//             return res.status(400).json({ error: 'Missing id, taskAssignedDate, or taskDueD ate' });
//         }

//         const task = await Task.findById(id);
//         if (!task) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         // const startDate = new Date(task.project.startDate);
//         // const endDate = new Date(task.project.endDate);
//         const assignedDate = new Date(taskAssignedDate);
//         const dueDate = new Date(taskDueDate);

//         // if (assignedDate < startDate || assignedDate > endDate || dueDate < startDate || dueDate > endDate) {
//         //     return res.status(400).json({ message: 'Task dates must fall within project start and end dates' });
//         // }

//         let status;
//         if (assignedDate >= dueDate) {
//             status = 'Pending';
//         } else if (status === 'Completed') {
//             status = 'Completed';
//         } else if (assignedDate < dueDate) {
//             status = 'In Progress';
//         }

//         const updatedTask = await Task.findByIdAndUpdate(id, { taskAssignedDate, taskDueDate, status }, { new: true });
//         res.status(200).json({ message: 'Task updated successfully', data: updatedTask });

//     } catch (error) {
//         console.error('Error updating task:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await Task.findByIdAndDelete(id);
        res.status(200).json(deletedProject);
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getIndividualTask = async (req, res) => {
    try {
        const { email, projectId, page, limit } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!projectId) {
            return res.status(400).json({ message: 'Project Id is required' });
        }

        let query = { taskAssignees: { $regex: email, $options: 'i' } };

        if (projectId) {
            query.projectId = projectId;
        }

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { projectId: 1 }
        };

        const tasks = await Task.paginate(query, options);

        if (tasks.docs) {
            const tasksWithTimeRemaining = tasks.docs.map(task => {
                const currentDate = new Date();
                const timeRemainingMillis = task.taskDueDate - currentDate.getTime();

                const days = Math.floor(timeRemainingMillis / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemainingMillis % (1000 * 60 * 60)) / (1000 * 60));

                return {
                    ...task.toJSON(),
                    timeRemaining: { days, hours, minutes }
                };
            });

            res.status(200).json({ ...tasks, docs: tasksWithTimeRemaining });
        } else {
            return res.status(404).json({ docs: [], message: 'No tasks found for provided criteria.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getStatus = async (req, res) => {
    try {
        const uniqueStatuses = await Task.distinct('status', { status: { $ne: null } }).exec();
        res.json({ docs: uniqueStatuses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSortTasks = async (req, res) => {
    try {
        const { page, limit, search, projectName, status } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { projectName: { $regex: new RegExp(search, 'i') } },
                { taskDescription: { $regex: new RegExp(search, 'i') } },
            ];
        }

        if (projectName) {
            query.projectName = { $regex: new RegExp(projectName, 'i') };
        }

        if (status) {
            query.status = status
        }

        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { status: 'desc', taskDueDate: 'asc' },
        };

        const tasks = await Task.paginate(query, options);

        const tasksWithTimeRemaining = tasks.docs.map(task => {
            const currentDate = new Date();
            const timeRemainingMillis = task.taskDueDate - currentDate.getTime();

            const days = Math.floor(timeRemainingMillis / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemainingMillis % (1000 * 60 * 60)) / (1000 * 60));

            return {
                ...task.toJSON(),
                timeRemaining: { days, hours, minutes }
            };
        });

        if (tasks.docs.length) {
            res.status(200).json({ ...tasks, docs: tasksWithTimeRemaining });
        } else {
            return res.status(404).json({ docs: [], message: 'No tasks found for provided criteria.' });
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getTaskDueNotify = async (req, res) => {
    const { email } = req.params;
    try {
        // Check if email exists in records
        const employeeExists = await Task.exists({ taskAssignees: email });
        if (!employeeExists) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Get tasks due tomorrow for the specified email
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tasks = await Task.find({
            taskAssignees: email,
            taskDueDate: {
                $gte: new Date(),
                $lt: tomorrow
            },
            status: { $ne: 'Completed' }
        });

        // Prepare task details
        const taskDetails = tasks.map(task => ({
            id: task._id,
            projectId: task.projectId,
            projectName: task.projectName,
            taskDescription: task.taskDescription,
            taskAssignees: task.taskAssignees,
            status: task.status,
            taskAssignedDate: task.taskAssignedDate,
            taskDueDate: task.taskDueDate
        }));

        if (taskDetails) {
            // Send email to employee
            // await sendMail({
            //     to: email,
            //     subject: 'Task Reminder',
            //     html: `Hi ${email},<br><br>Here are the tasks you have due today:<br><br>${taskDetails.map(task => `<li>${task.projectName} - ${task.taskDescription}</li>`).join('')}`
            // });
            return res.status(200).json({ tasks: taskDetails });
        }
        else {
            return res.status(200).json({ tasks: [] });
        }
        // Return task details as JSON
    } catch (error) {
        console.error('Error sending notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
