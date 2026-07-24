const validateAutocomplete = (req, res, next) => {
  const { input } = req.body;
  if (!input || typeof input !== 'string' || !input.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid "input" parameter in request body.'
    });
  }
  next();
};

const validateSearch = (req, res, next) => {
  const { placeId, address } = req.body;
  if (!placeId && !address) {
    return res.status(400).json({
      success: false,
      error: 'Either "placeId" or "address" must be provided in request body.'
    });
  }
  next();
};

const validateNearby = (req, res, next) => {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Both "lat" and "lng" must be provided in request body.'
    });
  }
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates: "lat" and "lng" must be numbers.'
    });
  }
  
  next();
};

module.exports = {
  validateAutocomplete,
  validateSearch,
  validateNearby
};
