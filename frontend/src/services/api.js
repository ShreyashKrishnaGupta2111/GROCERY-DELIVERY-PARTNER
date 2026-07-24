import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Creates a Razorpay order from the backend
 */
export const createPaymentOrder = async (amount) => {
  const response = await api.post('/payment/order', { amount });
  return response.data;
};

/**
 * Verifies a Razorpay payment signature
 */
export const verifyPaymentSignature = async (verificationData) => {
  const response = await api.post('/payment/verify', verificationData);
  return response.data;
};

export default api;

