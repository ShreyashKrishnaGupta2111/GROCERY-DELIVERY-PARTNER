import React, { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import SearchBar from '../components/SearchBar/SearchBar';
import SearchHistory from '../components/SearchHistory/SearchHistory';
import Map from '../components/Map/Map';
import GroceryCard from '../components/GroceryCard/GroceryCard';
import { StoreCardSkeleton } from '../components/Loading/Loading';
import { SlidersHorizontal, Map as MapIcon, List, EyeOff, Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const {
    location,
    nearbyStores,
    radius,
    setRadius,
    fetchNearbyStores,
    loadingLocation,
    loadingStores,
    hasSearchedStores,
    findNearbyGroceries
  } = useLocation();

  // Filters State
  const [sortBy, setSortBy] = useState('distance'); // distance | rating | open
  const [showClosed, setShowClosed] = useState(true);
  const [viewMode, setViewMode] = useState('split'); // split (desktop) | map | list (mobile toggle)

  // Handle Radius Change
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    if (hasSearchedStores && location.lat && location.lng) {
      fetchNearbyStores(location.lat, location.lng, newRadius);
    }
  };

  // Process nearby stores with filtering and sorting
  const processedStores = [...nearbyStores]
    .filter((store) => {
      if (!showClosed && store.opening_hours && !store.opening_hours.open_now) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'open') {
        const aOpen = a.opening_hours?.open_now ? 1 : 0;
        const bOpen = b.opening_hours?.open_now ? 1 : 0;
        return bOpen - aOpen;
      }
      // Default: distance sorted by geometry distance if possible (done client side in render)
      // Otherwise keep search ranking
      return 0;
    });

  return (
    <main className="w-full flex-1 flex flex-col h-[calc(100vh-73px)] overflow-hidden transition-colors bg-cream/30 dark:bg-zinc-950">
      
      {/* Search Header Row (Sticky top of page view) */}
      <div className="bg-white dark:bg-zinc-900 border-b border-ink/5 dark:border-white/5 p-4 z-10 transition-colors">
        <div className="w-11/12 max-w-[1180px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 max-w-2xl">
            <SearchBar placeholder="Type address or search nearby grocery stores..." />
          </div>
          
          {/* Mobile view toggle */}
          <div className="flex md:hidden w-full items-center justify-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-black text-xs uppercase transition-all border ${
                viewMode === 'list'
                  ? 'bg-ink text-white dark:bg-brand dark:text-ink'
                  : 'bg-white dark:bg-zinc-800 text-muted dark:text-zinc-400 border-ink/8 dark:border-white/5'
              }`}
            >
              <List size={16} />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 font-black text-xs uppercase transition-all border ${
                viewMode === 'map'
                  ? 'bg-ink text-white dark:bg-brand dark:text-ink'
                  : 'bg-white dark:bg-zinc-800 text-muted dark:text-zinc-400 border-ink/8 dark:border-white/5'
              }`}
            >
              <MapIcon size={16} />
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* SIDEBAR: Store listing & filters */}
        <section 
          className={`w-full md:w-[400px] lg:w-[460px] bg-white dark:bg-zinc-900 border-r border-ink/5 dark:border-white/5 flex flex-col h-full shrink-0 transition-all ${
            viewMode === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Filters Area */}
          <div className="p-5 border-b border-ink/5 dark:border-white/5 space-y-4 shrink-0 bg-cream/10 dark:bg-zinc-900">
            <SearchHistory />

            <div className="space-y-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase text-ink dark:text-zinc-400">
                <SlidersHorizontal size={14} className="stroke-[2.5]" />
                Filters & Settings
              </span>
              
              {/* Radius filter */}
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="col-span-1 text-xs font-bold text-muted dark:text-zinc-400">Radius</label>
                <select
                  value={radius}
                  onChange={handleRadiusChange}
                  className="col-span-2 p-2 text-xs font-black text-ink dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-ink/10 dark:border-white/5 rounded-xl outline-none"
                >
                  <option value={1000}>1 km (Short walk)</option>
                  <option value={2000}>2 km (Quick cycle)</option>
                  <option value={5000}>5 km (Standard Hub)</option>
                  <option value={10000}>10 km (Regional zone)</option>
                </select>
              </div>

              {/* Sort filter */}
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="col-span-1 text-xs font-bold text-muted dark:text-zinc-400">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="col-span-2 p-2 text-xs font-black text-ink dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-ink/10 dark:border-white/5 rounded-xl outline-none"
                >
                  <option value="distance">Distance (Closest)</option>
                  <option value="rating">Rating (Highest)</option>
                  <option value="open">Open Now</option>
                </select>
              </div>

              {/* Toggle show closed */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-muted dark:text-zinc-400">Show closed stores</label>
                <input
                  type="checkbox"
                  checked={showClosed}
                  onChange={(e) => setShowClosed(e.target.checked)}
                  className="w-4 h-4 rounded text-brand focus:ring-brand border-ink/10 dark:border-white/5"
                />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-muted dark:text-zinc-400 uppercase tracking-wider">
              <span>Grocery outlets near you</span>
              <span>{hasSearchedStores ? `${processedStores.length} stores` : 'No search triggered'}</span>
            </div>

            {loadingLocation || loadingStores ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <StoreCardSkeleton key={i} />)}
              </div>
            ) : !hasSearchedStores ? (
              <div className="p-6 rounded-3xl bg-brand/10 dark:bg-brand/5 border border-brand/20 space-y-4 shadow-sm select-none">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-ink dark:text-zinc-100 uppercase tracking-wider">
                    Selected Location Details
                  </h4>
                  <p className="text-xs text-muted dark:text-zinc-400 font-bold leading-normal">
                    📍 {location.address}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-1.5 text-xs text-muted dark:text-zinc-400 font-bold">
                    <div>
                      <span className="block text-[10px] uppercase font-black">Latitude</span>
                      <span className="text-ink dark:text-zinc-200 font-black">{location.lat?.toFixed(6) || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-black">Longitude</span>
                      <span className="text-ink dark:text-zinc-200 font-black">{location.lng?.toFixed(6) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={findNearbyGroceries}
                  disabled={loadingLocation || !location.lat}
                  className="w-full py-4 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:opacity-50"
                  type="button"
                >
                  Find Nearby Grocery Stores 🔍
                </button>
              </div>
            ) : processedStores.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-cream/20 dark:bg-zinc-800/30 border border-dashed border-ink/10 dark:border-white/5 text-center space-y-3 select-none">
                <span className="text-4xl block">🥦</span>
                <h4 className="text-sm font-black text-ink dark:text-zinc-100">No grocery stores found</h4>
                <p className="text-xs text-muted dark:text-zinc-400 font-bold leading-normal">
                  Try expanding the search radius or enter a different location in India.
                </p>
              </div>
            ) : (
              processedStores.map((store) => (
                <GroceryCard key={store.place_id} store={store} />
              ))
            )}
          </div>
        </section>

        {/* MAP CONTAINER: occupying remaining space */}
        <section 
          className={`flex-1 h-full p-4 md:p-6 ${
            viewMode === 'list' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[38px] shadow-premium overflow-hidden border border-ink/5 dark:border-white/5 p-1">
            <Map />
          </div>
        </section>
      </div>
    </main>
  );
}
