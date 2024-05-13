const express = require('express');
const nodeController = require('../controllers/nodeController'); 

const router = express.Router();

router.post('/addEmployee', nodeController.createEmployee)

router.post('/addTextToImage', nodeController.addTextToImage);

router.get('/getEmployee', nodeController.getEmployee)

module.exports = router;