const googleMapsService = require('../services/googleMapsService');
const { GOOGLE_MAPS_API_KEY } = require('../config/googleConfig');

// GET /api/health
const getHealthStatus = (req, res, next) => {
  try {
    const isConfigured = !!(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() && GOOGLE_MAPS_API_KEY !== 'LyBIp7Yfo8xtLJRdQXNC');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      googleMapsConfigured: isConfigured,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/location/autocomplete
const handleAutocomplete = async (req, res, next) => {
  try {
    const { input } = req.body;
    const suggestions = await googleMapsService.fetchAutocomplete(input);
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/location/search
const handleGeocode = async (req, res, next) => {
  try {
    const { placeId, address } = req.body;
    const location = await googleMapsService.geocodeAddress({ placeId, address });
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/location/nearby
const handleNearbyStores = async (req, res, next) => {
  try {
    const { lat, lng, radius, keyword } = req.body;
    const numericLat = parseFloat(lat);
    const numericLng = parseFloat(lng);
    const numericRadius = radius ? parseInt(radius, 10) : 5000;
    
    const stores = await googleMapsService.fetchNearbyStores(numericLat, numericLng, numericRadius, keyword);
    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/location/details/:placeId
const handlePlaceDetails = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    if (!placeId) {
      return res.status(400).json({ success: false, error: 'Missing placeId parameter.' });
    }
    const details = await googleMapsService.fetchPlaceDetails(placeId);
    res.status(200).json({
      success: true,
      data: details
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthStatus,
  handleAutocomplete,
  handleGeocode,
  handleNearbyStores,
  handlePlaceDetails
};
