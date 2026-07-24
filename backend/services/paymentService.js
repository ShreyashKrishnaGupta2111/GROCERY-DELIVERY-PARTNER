// In-memory payment logs store
const payments = [];

/**
 * Saves payment details to the mock database
 * @param {Object} paymentDetails - The transaction record
 * @returns {Promise<string>} Created Transaction/Doc ID
 */
const savePaymentDetails = async (paymentDetails) => {
  const transactionData = {
    ...paymentDetails,
    timestamp: new Date().toISOString()
  };

  const id = `tx_${Date.now()}_${Math.round(Math.random() * 1e5)}`;
  payments.push({
    id,
    ...transactionData
  });

  console.log(`[Payment Service] Saved transaction log [${id}]:`, transactionData);
  return id;
};

/**
 * Retrieves all stored payments
 * @returns {Promise<Array>} List of payments
 */
const getPayments = async () => {
  return [...payments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

module.exports = {
  savePaymentDetails,
  getPayments
};
