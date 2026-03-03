const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middlewares/authMiddleware');

router.post('/create', userController.createUser);
router.get('/', userController.viewUsers);
router.put('/update/:id', userController.updateUser);
router.get('/:id', authentication.authenticateToken, authentication.adminAuthorized, userController.getUserById);


module.exports = router;