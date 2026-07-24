const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { 
  validateAutocomplete, 
  validateSearch, 
  validateNearby 
} = require('../middleware/validateRequest');

// Health endpoint
router.get('/health', locationController.getHealthStatus);

// Autocomplete suggestions
router.post('/location/autocomplete', validateAutocomplete, locationController.handleAutocomplete);

// Geocode / coordinate search
router.post('/location/search', validateSearch, locationController.handleGeocode);

// Nearby search
router.post('/location/nearby', validateNearby, locationController.handleNearbyStores);

// Place details (on-demand phone/reviews retrieval)
router.get('/location/details/:placeId', locationController.handlePlaceDetails);

module.exports = router;
