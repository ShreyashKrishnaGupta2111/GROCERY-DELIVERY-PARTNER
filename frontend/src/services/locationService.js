import api from './api';

export const locationService = {
  // Get autocomplete location suggestions
  async getAutocomplete(input) {
    const response = await api.post('/location/autocomplete', { input });
    return response.data.data; // array of predictions
  },

  // Resolve a selected suggestion's coordinate geocoding
  async searchLocation({ placeId, address }) {
    const response = await api.post('/location/search', { placeId, address });
    return response.data.data; // { lat, lng, address }
  },

  // Fetch nearby grocery stores
  async getNearbyStores({ lat, lng, radius, keyword }) {
    const response = await api.post('/location/nearby', { lat, lng, radius, keyword });
    return response.data.data; // array of stores
  },

  // Fetch full details of a single store (e.g. phone number) on demand
  async getStoreDetails(placeId) {
    const response = await api.get(`/location/details/${placeId}`);
    return response.data.data; // detailed profile
  }
};
