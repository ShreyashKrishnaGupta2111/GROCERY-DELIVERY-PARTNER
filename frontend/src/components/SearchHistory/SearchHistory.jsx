import React from 'react';
import { useLocation } from '../../hooks/useLocation';
import { MapPin, Trash2, Clock } from 'lucide-react';

export default function SearchHistory() {
  const { searchHistory, selectLocation, clearHistory } = useLocation();

  if (searchHistory.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-extrabold text-ink dark:text-zinc-300">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs font-black">
          <Clock size={14} className="stroke-[2.5]" />
          Recent searches
        </span>
        <button
          onClick={clearHistory}
          type="button"
          className="text-xs text-red-500 hover:text-red-600 font-black flex items-center gap-1 transition-colors"
          aria-label="Clear history"
        >
          <Trash2 size={12} className="stroke-[2.5]" />
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {searchHistory.map((item, index) => (
          <button
            key={item.placeId || index}
            onClick={() => selectLocation({ placeId: item.placeId, address: item.address })}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-brand/20 dark:hover:bg-zinc-700/50 border border-ink/8 dark:border-white/5 rounded-full text-xs font-black text-ink dark:text-zinc-100 transition-all shadow-sm"
          >
            <MapPin size={12} className="text-muted dark:text-zinc-400 stroke-[2.5]" />
            {item.address.split(',')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
