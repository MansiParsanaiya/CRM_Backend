const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.post('/addTask', taskController.addTask);

router.get('/getAllTasks', taskController.getAllTasks);

router.get('/getTaskByProjectId/:projectId', taskController.getTaskByProjectId);

router.put('/updateTask/:id', taskController.updateTask);

router.delete('/deleteTask/:id', taskController.deleteTask);

router.get('/getIndividualTask', taskController.getIndividualTask);

router.get('/getStatus', taskController.getStatus);

router.get('/getSortTasks', taskController.getSortTasks);

router.get('/getTaskDueNotify/:email', taskController.getTaskDueNotify);

module.exports = router;