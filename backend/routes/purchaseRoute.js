const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create/:id', authentication.authenticateToken, purchaseController.createPurchase);
router.patch('/updateStatusToComplete/:id', authentication.authenticateToken, purchaseController.updatePurchase);
router.get('/my-purchases', authentication.authenticateToken, purchaseController.getMyPurchases);

module.exports = router;