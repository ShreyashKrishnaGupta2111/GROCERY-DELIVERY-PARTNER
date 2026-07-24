import React, { createContext, useState, useEffect } from 'react';
import { locationService } from '../services/locationService';
import { DEFAULT_CENTER, DELIVERY_RADIUS_KM } from '../utils/constants';
import api from '../services/api';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  // 0. Google Maps API Config State
  const [apiKey, setApiKey] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);

  // 1. Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // 2. Location & Stores State
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('current_location');
    return saved ? JSON.parse(saved) : {
      lat: DEFAULT_CENTER.lat,
      lng: DEFAULT_CENTER.lng,
      address: 'Sector 21, New Delhi'
    };
  });

  const [radius, setRadius] = useState(5000); // 5km default
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  // 3. Search History State
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('search_history');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Cart State (FlashBasket Cart Drawer)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('flash_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 5. Loading & Global UI States
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [hasSearchedStores, setHasSearchedStores] = useState(false);

  // Fetch Google Maps API key at startup
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await api.get('/config');
        if (response.data && response.data.googleMapsApiKey) {
          setApiKey(response.data.googleMapsApiKey);
        }
      } catch (err) {
        console.error('Failed to load Google Maps configuration:', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, []);


  // Apply dark mode styling class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('flash_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Location to localStorage
  useEffect(() => {
    localStorage.setItem('current_location', JSON.stringify(location));
  }, [location]);

  // Sync Search History to localStorage
  useEffect(() => {
    localStorage.setItem('search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Toast notification helper
  const showToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Add / remove items in the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.name === product.name);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        showToast(`${product.name} added in a flash!`);
        return newCart;
      } else {
        showToast(`${product.name} added in a flash!`);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (name, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.name === name) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (name) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== name));
  };

  const clearCart = () => setCart([]);

  // Fetch nearby grocery stores based on coordinates
  const fetchNearbyStores = async (lat, lng, currentRadius) => {
    setLoadingStores(true);
    try {
      const stores = await locationService.getNearbyStores({
        lat,
        lng,
        radius: currentRadius || radius,
        keyword: 'grocery'
      });
      setNearbyStores(stores);
    } catch (err) {
      console.error('Failed to load nearby stores:', err);
      showToast('Could not fetch nearby stores. Using offline fallback.');
    } finally {
      setLoadingStores(false);
    }
  };

  // Triggered when user selects a location from search autocomplete or history
  const selectLocation = async ({ placeId, address }) => {
    setLoadingLocation(true);
    setNearbyStores([]); // Clear old search results immediately
    setHasSearchedStores(false); // Reset search state
    try {
      const resolved = await locationService.searchLocation({ placeId, address });
      const newLoc = {
        lat: resolved.lat,
        lng: resolved.lng,
        address: resolved.address
      };
      
      setLocation(newLoc);
      setSelectedStore(null); // Reset selected store card

      // Save to Search History (remove duplicates, limit to 6 items)
      setSearchHistory((prevHistory) => {
        const filtered = prevHistory.filter(
          (item) => item.address.toLowerCase() !== resolved.address.toLowerCase()
        );
        return [{ placeId, address: resolved.address, lat: resolved.lat, lng: resolved.lng }, ...filtered].slice(0, 6);
      });

      showToast(`Centered on ${resolved.address.split(',')[0]} 📍`);
    } catch (err) {
      console.error('Failed to select location:', err);
      showToast('Error geocoding location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Find grocery stores near the selected location
  const findNearbyGroceries = async () => {
    if (!location.lat || !location.lng) {
      showToast('Please select a location first.');
      return;
    }
    setHasSearchedStores(true);
    showToast('Searching nearby grocery stores...');
    await fetchNearbyStores(location.lat, location.lng, radius);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    showToast('Search history cleared.');
  };

  return (
    <LocationContext.Provider
      value={{
        apiKey,
        loadingConfig,
        darkMode,
        toggleDarkMode,
        location,
        radius,
        setRadius,
        nearbyStores,
        selectedStore,
        setSelectedStore,
        searchHistory,
        selectLocation,
        fetchNearbyStores,
        clearHistory,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toasts,
        showToast,
        loadingLocation,
        loadingStores,
        hasSearchedStores,
        findNearbyGroceries
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
