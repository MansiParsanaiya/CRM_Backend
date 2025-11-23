const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');


router.post('/login', loginController.postLogin);

router.post('/register', registerController.postEmployee);

router.get('/getEmployee', registerController.getEmployee);

router.get('/getRoleEmployeeData', registerController.getRoleEmployeeData);

router.get('/getTotalEmployee', registerController.getTotalEmployee);

router.post('/getRole', registerController.getRole);

router.get('/getRoleEmployee', registerController.getRoleEmployee);

router.put('/updateEmployee/:id', registerController.updateEmployee);

router.delete('/deleteEmployee/:id', registerController.deleteEmployee);


module.exports = router;

