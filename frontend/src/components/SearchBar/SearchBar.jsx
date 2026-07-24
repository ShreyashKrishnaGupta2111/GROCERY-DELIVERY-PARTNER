import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { locationService } from '../../services/locationService';
import { Search, MapPin, Loader2, X } from 'lucide-react';

export default function SearchBar({ placeholder = "Search for a delivery location...", onSelect }) {
  const { selectLocation, showToast } = useLocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  // Fetch suggestions when query changes (with debouncing)
  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await locationService.getAutocomplete(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Error in location autocomplete:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (suggestion) => {
    setQuery(suggestion.description);
    setShowDropdown(false);
    setSuggestions([]);
    
    // Call select location in context
    await selectLocation({
      placeId: suggestion.place_id,
      address: suggestion.description
    });

    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="flex items-center gap-2.5 p-3.5 bg-white dark:bg-zinc-800 border border-ink/8 dark:border-white/5 rounded-2xl shadow-premium focus-within:ring-2 focus-within:ring-brand/50 transition-all">
        <MapPin className="text-muted dark:text-zinc-400 shrink-0 stroke-[2.5]" size={20} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-ink dark:text-white font-extrabold text-sm placeholder:text-muted dark:placeholder:text-zinc-500"
        />

        {loading && <Loader2 className="animate-spin text-muted shrink-0" size={18} />}
        
        {query && (
          <button 
            type="button" 
            onClick={handleClear} 
            className="p-1 rounded-full hover:bg-ink/5 dark:hover:bg-white/5 text-muted dark:text-zinc-400"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-zinc-800 border border-ink/8 dark:border-white/5 rounded-2xl shadow-premium z-40 overflow-hidden divide-y divide-ink/5 dark:divide-white/5 transition-all">
          {suggestions.map((suggestion) => (
            <li key={suggestion.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-5 py-4 hover:bg-brand/10 dark:hover:bg-zinc-700/50 flex items-start gap-3 transition-colors group"
              >
                <MapPin className="text-muted group-hover:text-brand dark:text-zinc-400 mt-0.5 shrink-0" size={16} />
                <div>
                  <span className="block text-sm font-black text-ink dark:text-zinc-100 leading-tight">
                    {suggestion.structured_formatting?.main_text || suggestion.description.split(',')[0]}
                  </span>
                  <span className="block text-xs text-muted dark:text-zinc-400 mt-1">
                    {suggestion.structured_formatting?.secondary_text || suggestion.description.split(',').slice(1).join(',')}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
