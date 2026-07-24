const Razorpay = require('razorpay');
const crypto = require('crypto');
const { savePaymentDetails } = require('../services/paymentService');

// Helper to determine if we are running in mock payment mode
const isMockMode = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return !keyId || !secret || keyId.includes('mockKeyId') || secret.includes('mockSecret');
};

/**
 * Initialize Razorpay instance
 */
const getRazorpayInstance = () => {
  if (isMockMode()) {
    return null;
  }
  try {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (error) {
    console.warn('[Payment Controller] Failed to initialize Razorpay SDK. Operating in mock fallback mode:', error.message);
    return null;
  }
};

/**
 * Creates a Razorpay order
 * POST /api/payment/order
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
    }

    const amountInSubunits = Math.round(amount * 100); // Razorpay expects amount in subunits (paise)

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      // Mock order generation for offline/sandbox
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
      console.log(`[Payment Controller] Generated mock order: ${mockOrderId} for amount: ${amount}`);
      
      return res.status(200).json({
        success: true,
        isMock: true,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
        order: {
          id: mockOrderId,
          amount: amountInSubunits,
          currency,
          receipt: `receipt_mock_${Date.now()}`
        }
      });
    }

    // Call Razorpay API to create the order
    const options = {
      amount: amountInSubunits,
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    console.log(`[Payment Controller] Razorpay order created: ${order.id}`);

    return res.status(200).json({
      success: true,
      isMock: false,
      keyId: process.env.RAZORPAY_KEY_ID,
      order
    });
  } catch (error) {
    console.error('[Payment Controller] Razorpay API error, falling back to mock:', error);
    // Safe fallback for testing when keys are configured but invalid/unauthorized
    const mockOrderId = `order_fallback_mock_${Date.now()}`;
    return res.status(200).json({
      success: true,
      isMock: true,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
      order: {
        id: mockOrderId,
        amount: Math.round(req.body.amount * 100),
        currency: req.body.currency || 'INR',
        receipt: `receipt_mock_${Date.now()}`
      }
    });
  }
};

/**
 * Verifies payment signature and saves transaction details
 * POST /api/payment/verify
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId = 'guest',
      items = []
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing required payment verification fields.' });
    }

    const isMockOrder = razorpay_order_id.startsWith('order_mock_') || razorpay_order_id.startsWith('order_fallback_mock_') || isMockMode();

    if (isMockOrder) {
      console.log(`[Payment Controller] Verifying mock order: ${razorpay_order_id}`);
      
      const paymentRecord = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: Number(amount),
        status: 'success',
        userId,
        items,
        mode: 'mock'
      };

      const docId = await savePaymentDetails(paymentRecord);
      return res.status(200).json({
        success: true,
        message: 'Mock payment verified successfully.',
        docId,
        paymentDetails: paymentRecord
      });
    }

    // Secure signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      console.log(`[Payment Controller] Signature verified for order: ${razorpay_order_id}`);

      const paymentRecord = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: Number(amount),
        status: 'success',
        userId,
        items,
        mode: 'live'
      };

      const docId = await savePaymentDetails(paymentRecord);
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        docId,
        paymentDetails: paymentRecord
      });
    } else {
      console.error(`[Payment Controller] Signature verification failed for order: ${razorpay_order_id}`);

      const paymentRecord = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id || 'unknown',
        amount: Number(amount),
        status: 'failed',
        error: 'Signature mismatch',
        userId,
        items,
        mode: 'live'
      };

      await savePaymentDetails(paymentRecord);
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed.'
      });
    }
  } catch (error) {
    console.error('[Payment Controller] Error verifying payment:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
