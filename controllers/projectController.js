const Project = require('../models/project'); 
const ArchiveProject = require("../models/archiveProject");
const Task = require('../models/task');

// ---------------------------
// Create Project
// ---------------------------
module.exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ---------------------------
// Get All Projects (Paginated & Search)
// ---------------------------
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
};

// ---------------------------
// Get List of Project Names
// ---------------------------
module.exports.getProjectName = async (req, res) => {
    try {
        const projects = await Project.find({}, 'projectName').sort({ projectName: 1 });
        const projectNames = projects.map(p => p.projectName);
        res.json({ docs: projectNames });
    } catch (error) {
        console.error('Error fetching project names:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ---------------------------
// Update Project + Update Tasks ProjectName
// ---------------------------
module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { projectName } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

        if (projectName) {
            await Task.updateMany({ projectId: id }, { projectName });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ---------------------------
// Delete Project + Archive + Delete Tasks
// ---------------------------
module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await Project.findById(id);

        if (deletedProject) {
            const archive = new ArchiveProject(deletedProject.toObject());
            await archive.save();
        }

        await Project.findByIdAndDelete(id);
        await Task.deleteMany({ projectId: id });

        res.status(200).json({ message: "Project deleted", data: deletedProject });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ---------------------------
// Get All Project Names (Simple List)
// ---------------------------
module.exports.getAllProjectName = async (req, res) => {
    try {
        const projects = await Project.find({}, 'projectName');
        const names = projects.map(p => p.projectName).sort();
        res.status(200).json(names);
    } catch (error) {
        console.error('Error fetching project names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
