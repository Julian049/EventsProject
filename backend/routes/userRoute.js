const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middlewares/authMiddleware');

router.post('/create', userController.createUser);
router.get('/', authentication.authenticateToken, userController.viewUsers);
router.put('/update/:id',userController.updateUser);
router.get('/:id', userController.getUserById);


module.exports = router;