import React, { useState } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { calculateDistance, formatPrice } from '../../utils/helpers';
import { locationService } from '../../services/locationService';
import { Star, MapPin, Navigation, Phone, Globe, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';

export default function GroceryCard({ store }) {
  const { location, selectedStore, setSelectedStore, showToast } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const {
    name,
    rating,
    user_ratings_total,
    vicinity,
    geometry,
    opening_hours,
    place_id
  } = store;

  const storeLat = geometry?.location?.lat;
  const storeLng = geometry?.location?.lng;

  // Calculate distance
  const distance = (location.lat && location.lng && storeLat && storeLng)
    ? calculateDistance(location.lat, location.lng, storeLat, storeLng)
    : null;

  const isOpen = opening_hours?.open_now;
  const isSelected = selectedStore?.place_id === place_id;

  const handleCardClick = () => {
    setSelectedStore(store);
  };

  const toggleExpand = async (e) => {
    e.stopPropagation(); // don't trigger selection
    const nextState = !expanded;
    setExpanded(nextState);

    if (nextState && !details) {
      setLoadingDetails(true);
      try {
        const fetchedDetails = await locationService.getStoreDetails(place_id);
        setDetails(fetchedDetails);
      } catch (err) {
        console.error('Error fetching details:', err);
        showToast('Could not fetch store phone number / reviews.');
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const getDirectionsUrl = () => {
    if (!storeLat || !storeLng) return '#';
    return `https://www.google.com/maps/dir/?api=1&destination=${storeLat},${storeLng}`;
  };

  const getMapsUrl = () => {
    if (!storeLat || !storeLng) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place_id}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-brand/10 dark:bg-brand/5 border-brand shadow-[0_8px_32px_rgba(247,215,0,0.15)]'
          : 'bg-white dark:bg-zinc-800 border-ink/5 dark:border-white/5 hover:border-ink/15 dark:hover:border-white/10 shadow-subtle hover:-translate-y-0.5'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-base font-black text-ink dark:text-zinc-100 leading-tight mb-1 group-hover:text-brand">
            {name}
          </h3>
          
          <div className="flex items-center gap-1.5 flex-wrap">
            {rating && (
              <div className="flex items-center gap-0.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-md text-xs font-black">
                <Star size={12} className="fill-current" />
                <span>{rating}</span>
              </div>
            )}
            
            {user_ratings_total && (
              <span className="text-xs text-muted dark:text-zinc-400 font-bold">
                ({user_ratings_total} reviews)
              </span>
            )}

            {distance !== null && (
              <span className="text-xs text-brand-strong dark:text-brand font-black ml-1">
                📍 {distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        {/* Expand Details Trigger */}
        <button
          onClick={toggleExpand}
          className="p-1 rounded-full hover:bg-ink/5 dark:hover:bg-white/5 text-muted dark:text-zinc-400"
          type="button"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp size={20} className="stroke-[2.5]" /> : <ChevronDown size={20} className="stroke-[2.5]" />}
        </button>
      </div>

      <p className="text-xs text-muted dark:text-zinc-400 font-bold mt-2.5 flex items-start gap-1.5">
        <MapPin size={14} className="shrink-0 text-muted dark:text-zinc-500 mt-0.5 stroke-[2.5]" />
        <span>{vicinity}</span>
      </p>

      {/* Opening hours pill */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-muted dark:text-zinc-500 stroke-[2.5]" />
          <span className={`text-xs font-black ${isOpen ? 'text-green' : 'text-red-500'}`}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Expanded details container */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-ink/5 dark:border-white/5 space-y-3 animate-fadeIn text-xs text-muted dark:text-zinc-400 font-bold">
          {loadingDetails ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-zinc-200 dark:border-zinc-700 border-t-brand rounded-full animate-spin" />
              <span>Loading store profile...</span>
            </div>
          ) : (
            <>
              {details?.formatted_phone_number && (
                <p className="flex items-center gap-2">
                  <Phone size={14} className="stroke-[2.5] text-muted shrink-0" />
                  <a href={`tel:${details.formatted_phone_number}`} className="hover:underline text-ink dark:text-zinc-300 font-black">
                    {details.formatted_phone_number}
                  </a>
                </p>
              )}
              {details?.website && (
                <p className="flex items-center gap-2">
                  <Globe size={14} className="stroke-[2.5] text-muted shrink-0" />
                  <a href={details.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-ink dark:text-zinc-300 font-black truncate max-w-[200px]">
                    Visit website
                  </a>
                </p>
              )}
              
              {/* Highlight reviews if available */}
              {details?.reviews && details.reviews.length > 0 && (
                <div className="mt-2.5 bg-cream dark:bg-zinc-800/50 p-3 rounded-2xl border border-ink/5 dark:border-white/5">
                  <span className="block text-[10px] font-black uppercase text-ink dark:text-zinc-300 tracking-wider mb-1 flex items-center gap-1">
                    <Info size={10} className="stroke-[2.5]" />
                    Featured customer review
                  </span>
                  <p className="italic text-zinc-600 dark:text-zinc-400 leading-normal font-medium">
                    "{details.reviews[0].text.slice(0, 100)}..."
                  </p>
                  <span className="block text-[10px] font-black text-right mt-1.5 text-zinc-500">
                    - {details.reviews[0].author_name}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2 px-3 bg-green hover:bg-green-dark text-white rounded-full text-xs font-black shadow-md hover:scale-[1.02] transition-transform text-center flex items-center justify-center gap-1.5"
        >
          <Navigation size={12} className="fill-current stroke-[2.5]" />
          Directions
        </a>
        <a
          href={getMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2 px-3 bg-white dark:bg-zinc-700 hover:bg-ink/5 dark:hover:bg-zinc-600 text-ink dark:text-zinc-100 border border-ink/8 dark:border-white/5 rounded-full text-xs font-black hover:scale-[1.02] transition-transform text-center"
        >
          View on Maps
        </a>
      </div>
    </div>
  );
}
