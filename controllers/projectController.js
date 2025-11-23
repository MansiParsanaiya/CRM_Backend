<<<<<<< HEAD
const Project = require('../models/project'); 
const ArchiveProject = require("../models/archiveProject")
const Task = require('../models/task');

=======
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed

module.exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
<<<<<<< HEAD
};
=======
}
>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed

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
<<<<<<< HEAD
};

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        await Task.updateMany({ projectId: id }, { projectName: projectName });
=======
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

>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
<<<<<<< HEAD
};
=======
}
>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
<<<<<<< HEAD
        const deletedProject = await Project.findById(id);

        if (deletedProject) {
            const archiveProject = new ArchiveProject(deletedProject.toObject());
            await archiveProject.save();
        }

        await Project.findByIdAndDelete(id);

        await Task.deleteMany({ projectId: id });


        console.log("Deleted successfully");
        res.status(201).send({ data: deletedProject });
=======
        // Delete the project
        const deletedProject = await Project.findByIdAndDelete(id);

        // Delete all tasks associated with the deleted project
        await Task.deleteMany({ projectId: id });

        res.status(200).json(deletedProject);
>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
<<<<<<< HEAD

    
};

module.exports.getAllProjectName = async (req, res) => {
    try {

        const projects = await Project.find({});
        const projectNames = projects.map(project => project.projectName);
        projectNames.sort((a, b) => {
                return a.localeCompare(b.name);
              });
        res.status(200).json(projectNames);
    } catch (error) {
        console.error('Error fetching projects names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

=======
}
>>>>>>> 9f9931e0027de09c1221dcf8d5bb6e7c1d0dffed
