import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { useLocation } from '../../hooks/useLocation';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { mapService } from '../../services/mapService';
import { Spinner } from '../Loading/Loading';
import { Locate, HelpCircle } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '450px',
  borderRadius: '34px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true, // Allow users to toggle Satellite/Map view
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Simplified offline preview component
function OfflineFallback({ location, nearbyStores }) {
  return (
    <div className="w-full min-h-[420px] rounded-[34px] border border-ink/8 dark:border-white/5 bg-gradient-to-br from-green/10 to-brand/10 p-8 flex flex-col items-center justify-center text-center">
      <HelpCircle size={44} className="text-muted mb-2 stroke-[2.5]" />
      <h3 className="text-xl font-black text-ink dark:text-zinc-100">Google Map Preview</h3>
      <p className="text-xs text-muted dark:text-zinc-400 font-bold max-w-sm mt-2 leading-relaxed">
        Google Maps SDK is offline. Add your API key in <code>.env</code> and run the backend server to activate live maps.
      </p>
      
      {/* Render simplified mock listing instead */}
      <div className="mt-6 p-4 bg-white dark:bg-zinc-800 rounded-3xl w-full max-w-md border border-ink/5 dark:border-white/5 text-xs text-left font-bold text-muted dark:text-zinc-400 space-y-1 shadow-md">
        <p className="text-ink dark:text-white font-black text-sm mb-1.5 flex items-center gap-1.5">
          🎯 Current Target Zone
        </p>
        <p>• Latitude: {location.lat}</p>
        <p>• Longitude: {location.lng}</p>
        <p>• Address: {location.address}</p>
        <p>• Nearby Stores Count: {nearbyStores.length}</p>
      </div>
    </div>
  );
}

// Inner component loaded only when API key is resolved to prevent multiple hooks loader calls
function GoogleMapCanvas({ apiKey }) {
  const { isLoaded, loadError } = useGoogleMaps(apiKey);
  const {
    location,
    nearbyStores,
    selectedStore,
    setSelectedStore,
    radius,
    selectLocation,
    showToast
  } = useLocation();

  const [mapRef, setMapRef] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  // Re-center and fit bounds when stores or location change
  useEffect(() => {
    if (!mapRef || !location.lat || !location.lng) return;

    // Pan to user location
    mapRef.panTo({ lat: location.lat, lng: location.lng });

    // Auto-zoom/fit bounds to encompass all nearby stores
    if (nearbyStores.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: location.lat, lng: location.lng });
      
      nearbyStores.forEach((store) => {
        const lat = store.geometry?.location?.lat;
        const lng = store.geometry?.location?.lng;
        if (lat && lng) {
          bounds.extend({ lat, lng });
        }
      });
      
      mapRef.fitBounds(bounds);
      
      // Prevent zooming in too close if there is only 1 marker
      const listener = google.maps.event.addListener(mapRef, 'bounds_changed', () => {
        if (mapRef.getZoom() > 15) {
          mapRef.setZoom(14);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [location, nearbyStores, mapRef]);

  // Sync selectedStore from context to display its info window on map
  useEffect(() => {
    if (selectedStore) {
      setActiveMarker(selectedStore);
    } else {
      setActiveMarker(null);
    }
  }, [selectedStore]);

  // Get user's current GPS position
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    showToast('Locating your position...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Resolve GPS coords using address search / geocode
        await selectLocation({
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
      },
      (error) => {
        console.error('GPS error:', error);
        showToast('Unable to retrieve location. Geolocation permission denied.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapLoad = (map) => {
    setMapRef(map);
  };

  if (loadError) {
    return <OfflineFallback location={location} nearbyStores={nearbyStores} />;
  }

  if (!isLoaded) {
    return (
      <div className="w-full min-h-[450px] rounded-[34px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Spinner />
          <p className="text-xs text-muted dark:text-zinc-400 font-bold">Mounting live map canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[450px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={{ lat: location.lat, lng: location.lng }}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* User Target Marker */}
        {location.lat && location.lng && (
          <Marker
            position={{ lat: location.lat, lng: location.lng }}
            icon={mapService.getUserMarkerIcon()}
            title="Your search location"
          />
        )}

        {/* Search radius visualization circle */}
        {location.lat && location.lng && (
          <Circle
            center={{ lat: location.lat, lng: location.lng }}
            radius={radius}
            options={{
              strokeColor: '#2fb344',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#e9ff58',
              fillOpacity: 0.15,
            }}
          />
        )}

        {/* Grocery Store Markers */}
        {nearbyStores.map((store) => {
          const lat = store.geometry?.location?.lat;
          const lng = store.geometry?.location?.lng;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={store.place_id}
              position={{ lat, lng }}
              icon={mapService.getStoreMarkerIcon()}
              title={store.name}
              onClick={() => {
                setSelectedStore(store);
                setActiveMarker(store);
              }}
            />
          );
        })}

        {/* Info Window for Selected Marker */}
        {activeMarker && (
          <InfoWindow
            position={{
              lat: activeMarker.geometry.location.lat,
              lng: activeMarker.geometry.location.lng,
            }}
            onCloseClick={() => {
              setActiveMarker(null);
              setSelectedStore(null);
            }}
          >
            <div className="p-1 font-bold text-zinc-900 text-xs min-w-[120px]">
              <h4 className="font-black text-sm text-ink leading-tight mb-1">{activeMarker.name}</h4>
              <p className="text-zinc-500">{activeMarker.vicinity}</p>
              {activeMarker.rating && (
                <div className="flex items-center gap-0.5 text-yellow-500 mt-1">
                  ★ <span className="font-extrabold">{activeMarker.rating}</span>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* GPS Locate Button Overlay */}
      <button
        onClick={handleLocateUser}
        type="button"
        className="absolute bottom-4 right-4 p-3 bg-ink text-white dark:bg-white dark:text-ink hover:scale-105 active:scale-95 transition-transform flex items-center justify-center rounded-2xl shadow-premium border border-white/10 z-10"
        title="Find my current location"
        aria-label="Locate me"
      >
        <Locate size={20} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// Outer wrapper managing configuration loading
export default function Map() {
  const { apiKey, loadingConfig } = useLocation();

  if (loadingConfig) {
    return (
      <div className="w-full min-h-[450px] rounded-[34px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Spinner />
          <p className="text-xs text-muted dark:text-zinc-400 font-bold">Checking maps configuration...</p>
        </div>
      </div>
    );
  }

  // Always render the actual Google Map canvas. If loading fails, the inner component will show the fallback.
  return <GoogleMapCanvas apiKey={apiKey || ''} />;
}
