const axios = require('axios');
const { GOOGLE_MAPS_API_KEY } = require('../config/googleConfig');

// Helper to check if API key is valid / exists
const hasApiKey = () => {
  return GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() && GOOGLE_MAPS_API_KEY !== 'LyBIp7Yfo8xtLJRdQXNC';
};

// Mock data generator for testing when API key is not present
const getMockAutocomplete = (input) => {
  const suggestions = [
    { description: 'Sector 21, New Delhi, Delhi, India', place_id: 'mock_place_1' },
    { description: 'Connaught Place, New Delhi, Delhi, India', place_id: 'mock_place_2' },
    { description: 'Dwarka Sector 12, New Delhi, Delhi, India', place_id: 'mock_place_3' },
    { description: 'Indiranagar, Bengaluru, Karnataka, India', place_id: 'mock_place_4' },
    { description: 'Andheri West, Mumbai, Maharashtra, India', place_id: 'mock_place_5' },
    { description: 'Saket, New Delhi, Delhi, India', place_id: 'mock_place_6' },
    { description: 'Patna Junction, Patna, Bihar, India', place_id: 'mock_place_7' },
    { description: 'Civil Lines, Kanpur, Uttar Pradesh, India', place_id: 'mock_place_8' },
    { description: 'Gomti Nagar, Lucknow, Uttar Pradesh, India', place_id: 'mock_place_9' },
    { description: 'Connaught Place, New Delhi, 110001, India', place_id: 'mock_place_10' },
    { description: 'Ana Sagar Lake, Ajmer, Rajasthan, India', place_id: 'mock_place_11' },
    { description: 'Noida Sector 62, Noida, Uttar Pradesh, India', place_id: 'mock_place_12' },
    { description: 'Assi Ghat, Varanasi, Uttar Pradesh, India', place_id: 'mock_place_13' },
    { description: 'Hawa Mahal, Jaipur, Rajasthan, India', place_id: 'mock_place_14' },
    { description: 'Koregaon Park, Pune, Maharashtra, India', place_id: 'mock_place_15' },
    { description: 'T Nagar, Chennai, Tamil Nadu, India', place_id: 'mock_place_16' },
    { description: 'Gachibowli, Hyderabad, Telangana, India', place_id: 'mock_place_17' }
  ];
  return suggestions.filter(s => s.description.toLowerCase().includes(input.toLowerCase()));
};

const getMockGeocode = (placeId, address) => {
  const mockCoords = {
    'mock_place_1': { lat: 28.552, lng: 77.058, address: 'Sector 21, New Delhi, Delhi, India' },
    'mock_place_2': { lat: 28.6304, lng: 77.2177, address: 'Connaught Place, New Delhi, Delhi, India' },
    'mock_place_3': { lat: 28.5921, lng: 77.0461, address: 'Dwarka Sector 12, New Delhi, Delhi, India' },
    'mock_place_4': { lat: 12.97189, lng: 77.6413, address: 'Indiranagar, Bengaluru, Karnataka, India' },
    'mock_place_5': { lat: 19.1363, lng: 72.8271, address: 'Andheri West, Mumbai, Maharashtra, India' },
    'mock_place_6': { lat: 28.5244, lng: 77.2066, address: 'Saket, New Delhi, Delhi, India' },
    'mock_place_7': { lat: 25.6026, lng: 85.1376, address: 'Patna Junction, Patna, Bihar, India' },
    'mock_place_8': { lat: 26.4719, lng: 80.3512, address: 'Civil Lines, Kanpur, Uttar Pradesh, India' },
    'mock_place_9': { lat: 26.8532, lng: 80.9995, address: 'Gomti Nagar, Lucknow, Uttar Pradesh, India' },
    'mock_place_10': { lat: 28.6304, lng: 77.2177, address: 'Connaught Place, New Delhi, 110001, India' },
    'mock_place_11': { lat: 26.4691, lng: 74.6263, address: 'Ana Sagar Lake, Ajmer, Rajasthan, India' },
    'mock_place_12': { lat: 28.6273, lng: 77.3725, address: 'Noida Sector 62, Noida, Uttar Pradesh, India' },
    'mock_place_13': { lat: 25.2897, lng: 83.0076, address: 'Assi Ghat, Varanasi, Uttar Pradesh, India' },
    'mock_place_14': { lat: 26.9239, lng: 75.8267, address: 'Hawa Mahal, Jaipur, Rajasthan, India' },
    'mock_place_15': { lat: 18.5362, lng: 73.8930, address: 'Koregaon Park, Pune, Maharashtra, India' },
    'mock_place_16': { lat: 13.0418, lng: 80.2341, address: 'T Nagar, Chennai, Tamil Nadu, India' },
    'mock_place_17': { lat: 17.4483, lng: 78.3488, address: 'Gachibowli, Hyderabad, Telangana, India' }
  };

  if (placeId && mockCoords[placeId]) {
    return mockCoords[placeId];
  }
  
  // Default fallback (New Delhi)
  return { lat: 28.6139, lng: 77.209, address: address || 'New Delhi, Delhi, India' };
};

const getMockNearbyStores = (lat, lng, radius) => {
  // Generate 5 mock grocery stores near the coordinates
  const storeNames = [
    'SuperMart Grocery', 'Green Grocer Fresh', 'Daily Needs Supermarket',
    'Organic Harvest Store', 'QuickBasket Groceries', 'Reliance Smart Point',
    'Aman Kirana Store', 'Modern Aisle Groceries'
  ];
  
  const addresses = [
    'Main Market Rd, Block B', 'Opposite Metro Station Gate 3',
    'Pocket 4, Sector Road', 'Avenue 24, Near Community Center',
    'Shop No 14, Central Market', 'Ground Floor, Galleria Mall'
  ];

  const phoneNumbers = ['+91 98765 43210', '+91 88776 65544', '+91 99887 76655', ''];

  const stores = [];
  const count = 5;

  for (let i = 0; i < count; i++) {
    // Generate slight offset for coordinate variation (roughly within radius)
    const latOffset = (Math.random() - 0.5) * (radius / 111000); // 111km per lat degree
    const lngOffset = (Math.random() - 0.5) * (radius / (111000 * Math.cos(lat * Math.PI / 180)));

    const storeLat = lat + latOffset;
    const storeLng = lng + lngOffset;

    stores.push({
      place_id: `mock_store_${i}_${Math.floor(storeLat * 1000)}`,
      name: storeNames[i % storeNames.length],
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      user_ratings_total: Math.floor(25 + Math.random() * 850),
      vicinity: `${addresses[i % addresses.length]}, Area ${i + 1}`,
      geometry: {
        location: {
          lat: storeLat,
          lng: storeLng
        }
      },
      opening_hours: {
        open_now: Math.random() > 0.3
      },
      formatted_phone_number: phoneNumbers[i % phoneNumbers.length] || null,
      photos: [
        {
          photo_reference: `mock_photo_ref_${i}`,
          height: 400,
          width: 600
        }
      ]
    });
  }

  return stores;
};

// Autocomplete suggestions
const fetchAutocomplete = async (input) => {
  if (!hasApiKey()) {
    console.log('Using mock autocomplete for input:', input);
    return getMockAutocomplete(input);
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const response = await axios.get(url, {
      params: {
        input,
        key: GOOGLE_MAPS_API_KEY,
        types: 'geocode|establishment',
        components: 'country:in'
      }
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
    }

    return response.data.predictions || [];
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error.message);
    throw error;
  }
};

// Get lat/lng from place ID or address text
const geocodeAddress = async ({ placeId, address }) => {
  if (!hasApiKey()) {
    console.log('Using mock geocode for:', { placeId, address });
    return getMockGeocode(placeId, address);
  }

  try {
    if (placeId) {
      // Get coordinates via Place Details API
      const url = 'https://maps.googleapis.com/maps/api/place/details/json';
      const response = await axios.get(url, {
        params: {
          place_id: placeId,
          fields: 'geometry,formatted_address,name',
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places Details API error: ${response.data.status}`);
      }

      const { geometry, formatted_address, name } = response.data.result;
      return {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
        address: formatted_address || name
      };
    } else {
      // Get coordinates via Geocoding API
      const url = 'https://maps.googleapis.com/maps/api/geocode/json';
      const response = await axios.get(url, {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Geocoding API error: ${response.data.status}`);
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      };
    }
  } catch (error) {
    console.error('Error in geocoding:', error.message);
    throw error;
  }
};

// Fetch nearby grocery stores
const fetchNearbyStores = async (lat, lng, radius = 5000, keyword = 'grocery') => {
  if (!hasApiKey()) {
    console.log(`Using mock nearby stores for lat: ${lat}, lng: ${lng}, radius: ${radius}`);
    return getMockNearbyStores(lat, lng, radius);
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type: 'grocery_or_supermarket',
        keyword,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Nearby Search API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
    }

    const results = response.data.results || [];
    
    // We can also augment these results with telephone details if requested,
    // but since calling Details for each store is expensive, we can let the frontend 
    // fetch details on-demand or use the formatted_phone_number parameter if present.
    // Place Nearby Search doesn't return phone numbers, so we return what we have,
    // and if a detail is requested, we can write a details query.
    return results;
  } catch (error) {
    console.error('Error fetching nearby stores:', error.message);
    throw error;
  }
};

// Optional: Fetch place details (e.g. phone number) for a specific store on-demand
const fetchPlaceDetails = async (placeId) => {
  if (!hasApiKey()) {
    return {
      formatted_phone_number: '+91 99999 88888',
      international_phone_number: '+91 99999 88888',
      website: 'https://flashbasket.example.com',
      reviews: [
        { author_name: 'Amit Kumar', rating: 5, text: 'Best fresh veggies!' },
        { author_name: 'Priya Sharma', rating: 4, text: 'Delivery is really fast.' }
      ]
    };
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    const response = await axios.get(url, {
      params: {
        place_id: placeId,
        fields: 'formatted_phone_number,international_phone_number,website,reviews,opening_hours',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Place Details API error: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    throw error;
  }
};

module.exports = {
  fetchAutocomplete,
  geocodeAddress,
  fetchNearbyStores,
  fetchPlaceDetails
};
