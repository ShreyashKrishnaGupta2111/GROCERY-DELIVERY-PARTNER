const dotenv = require('dotenv');
const path = require('path');

// Ensure env variables are loaded
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') }); // fallback to root env

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const PORT = process.env.PORT || 5000;

if (!GOOGLE_MAPS_API_KEY) {
  console.warn('WARNING: GOOGLE_MAPS_API_KEY is not defined in the environment variables.');
}

module.exports = {
  GOOGLE_MAPS_API_KEY,
  PORT,
  defaultCenter: { lat: 28.6139, lng: 77.209 }, // New Delhi
  deliveryRadiusKm: 4
};
