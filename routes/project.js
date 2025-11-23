const express = require('express');
const projectController = require('../controllers/projectController'); 

const router = express.Router();

router.post('/addProject', projectController.createProject)

router.get('/getProject', projectController.getAllProjects)

router.put('/updateProject/:id', projectController.updateProject)

router.delete('/deleteProject/:id', projectController.deleteProject)

router.get('/getProjectName', projectController.getProjectName);

module.exports = router;