const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

module.exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getAllProjects = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { projectName: { $regex: new RegExp(search, 'i') } },
                { projectDescription: { $regex: new RegExp(search, 'i') } },
                { projectReference: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const projects = await Project.paginate(query, options);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getProjectName = async (req, res) => {
    try {
        const projects = await Project.find({}, 'projectName').sort({ projectName: 1 });
        const projectNames = projects.map(project => project.projectName);
        res.json({ docs: projectNames });
    } catch (error) {
        console.error('Error fetching project names:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { projectName } = req.body;

    try {
        // Update the project
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

        // Update the projectName for all associated tasks
        await Task.updateMany({ projectId: id }, { projectName: projectName });

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete the project
        const deletedProject = await Project.findByIdAndDelete(id);

        // Delete all tasks associated with the deleted project
        await Task.deleteMany({ projectId: id });

        res.status(200).json(deletedProject);
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}