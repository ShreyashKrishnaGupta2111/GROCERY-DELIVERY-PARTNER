import api from './api';

// Client-side Google Maps JS SDK Fallbacks (used if backend is offline but key is present and SDK loaded)
const getAutocompleteFromGoogle = (input) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return reject(new Error('Google Maps places library not loaded'));
    }
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({
      input,
      componentRestrictions: { country: 'in' },
      types: ['geocode', 'establishment']
    }, (predictions, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK && status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        return reject(new Error(`Autocomplete status error: ${status}`));
      }
      resolve(predictions || []);
    });
  });
};

const geocodeFromGoogle = ({ placeId, address }) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject(new Error('Google Maps SDK not loaded'));
    }
    if (placeId) {
      // Use PlacesService to get details (including geometry)
      const dummy = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummy);
      service.getDetails({
        placeId,
        fields: ['geometry', 'formatted_address', 'name']
      }, (result, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          return reject(new Error(`PlacesService status error: ${status}`));
        }
        resolve({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          address: result.formatted_address || result.name
        });
      });
    } else {
      // Use Geocoder
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status !== window.google.maps.GeocoderStatus.OK) {
          return reject(new Error(`Geocoder status error: ${status}`));
        }
        const result = results[0];
        resolve({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          address: result.formatted_address
        });
      });
    }
  });
};

const getNearbyStoresFromGoogle = ({ lat, lng, radius, keyword }) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return reject(new Error('Google Maps places library not loaded'));
    }
    const dummy = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(dummy);
    service.nearbySearch({
      location: { lat, lng },
      radius: radius || 5000,
      type: 'grocery_or_supermarket',
      keyword: keyword || 'grocery'
    }, (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK && status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        return reject(new Error(`Nearby Search status error: ${status}`));
      }
      
      const parsedResults = (results || []).map(store => ({
        place_id: store.place_id,
        name: store.name,
        rating: store.rating,
        user_ratings_total: store.user_ratings_total,
        vicinity: store.vicinity,
        geometry: {
          location: {
            lat: store.geometry.location.lat(),
            lng: store.geometry.location.lng()
          }
        },
        opening_hours: {
          open_now: store.opening_hours ? (typeof store.opening_hours.isOpen === 'function' ? store.opening_hours.isOpen() : !!store.opening_hours.open_now) : false
        },
        photos: store.photos
      }));
      resolve(parsedResults);
    });
  });
};

const getStoreDetailsFromGoogle = (placeId) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return reject(new Error('Google Maps places library not loaded'));
    }
    const dummy = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(dummy);
    service.getDetails({
      placeId,
      fields: ['formatted_phone_number', 'international_phone_number', 'website', 'reviews', 'opening_hours']
    }, (result, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return reject(new Error(`Place Details status error: ${status}`));
      }
      resolve({
        formatted_phone_number: result.formatted_phone_number,
        international_phone_number: result.international_phone_number,
        website: result.website,
        reviews: result.reviews,
        opening_hours: result.opening_hours
      });
    });
  });
};

// Client-side Mock Data Fallbacks (used if backend is offline and no client API key loaded)
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
  return { lat: 28.6139, lng: 77.209, address: address || 'New Delhi, Delhi, India' };
};

const getMockNearbyStores = (lat, lng, radius) => {
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
    const latOffset = (Math.random() - 0.5) * (radius / 111000);
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

const isGoogleLoaded = () => typeof window !== 'undefined' && window.google && window.google.maps;

// Exported service
export const locationService = {
  // Get autocomplete location suggestions
  async getAutocomplete(input) {
    try {
      const response = await api.post('/location/autocomplete', { input });
      return response.data.data;
    } catch (err) {
      console.warn('[Location Service] Backend autocomplete failed. Falling back:', err.message);
      if (isGoogleLoaded()) {
        try {
          return await getAutocompleteFromGoogle(input);
        } catch (gErr) {
          console.warn('[Location Service] Google Places SDK autocomplete failed:', gErr.message);
        }
      }
      return getMockAutocomplete(input);
    }
  },

  // Resolve a selected suggestion's coordinate geocoding
  async searchLocation({ placeId, address }) {
    try {
      const response = await api.post('/location/search', { placeId, address });
      return response.data.data;
    } catch (err) {
      console.warn('[Location Service] Backend geocoding failed. Falling back:', err.message);
      if (isGoogleLoaded()) {
        try {
          return await geocodeFromGoogle({ placeId, address });
        } catch (gErr) {
          console.warn('[Location Service] Google Maps SDK geocoding failed:', gErr.message);
        }
      }
      return getMockGeocode(placeId, address);
    }
  },

  // Fetch nearby grocery stores
  async getNearbyStores({ lat, lng, radius, keyword }) {
    try {
      const response = await api.post('/location/nearby', { lat, lng, radius, keyword });
      return response.data.data;
    } catch (err) {
      console.warn('[Location Service] Backend nearby search failed. Falling back:', err.message);
      if (isGoogleLoaded()) {
        try {
          return await getNearbyStoresFromGoogle({ lat, lng, radius, keyword });
        } catch (gErr) {
          console.warn('[Location Service] Google Maps SDK nearby search failed:', gErr.message);
        }
      }
      return getMockNearbyStores(lat, lng, radius);
    }
  },

  // Fetch full details of a single store on demand
  async getStoreDetails(placeId) {
    try {
      const response = await api.get(`/location/details/${placeId}`);
      return response.data.data;
    } catch (err) {
      console.warn('[Location Service] Backend place details failed. Falling back:', err.message);
      if (isGoogleLoaded()) {
        try {
          return await getStoreDetailsFromGoogle(placeId);
        } catch (gErr) {
          console.warn('[Location Service] Google Maps SDK place details failed:', gErr.message);
        }
      }
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
  }
};
