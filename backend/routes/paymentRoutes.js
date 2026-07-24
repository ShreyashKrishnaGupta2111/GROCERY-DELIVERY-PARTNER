const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

// Route to generate a new Razorpay order
router.post('/order', createOrder);

// Route to verify the payment signature
router.post('/verify', verifyPayment);

module.exports = router;
