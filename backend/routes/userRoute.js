const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middlewares/authMiddleware');

router.post('/create', userController.createUser);
router.get('/', authentication.authenticateToken, authentication.adminAuthorized, userController.viewUsers);
router.put('/update/:id', authentication.authenticateToken, authentication.updateUserAuthorized, userController.updateUser);
router.get('/:id', authentication.authenticateToken, authentication.adminAuthorized, userController.getUserById);
router.delete('/delete/:id', authentication.authenticateToken, authentication.deleteUserAuthorized, userController.deleteUser);

module.exports = router;