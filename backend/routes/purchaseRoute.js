const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authentication = require("../middlewares/authMiddleware");

// router.post('/create', authentication.authenticateToken, purchaseController.createPurchase);
router.post('/create', purchaseController.createPurchase);

module.exports = router;