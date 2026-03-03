const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create', authentication.authenticateToken, authentication.adminAuthorized, categoryController.createCategory);
router.get('/', categoryController.viewCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/update/:id', authentication.authenticateToken, authentication.adminAuthorized, categoryController.updateCategory);
router.patch('/disable/:id', authentication.authenticateToken, authentication.adminAuthorized, categoryController.disableCategory);

module.exports = router;