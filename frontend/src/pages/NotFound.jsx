import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="w-11/12 max-w-[1180px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
      <span className="text-7xl mb-4 animate-bounce">⚡</span>
      <h1 className="text-4xl md:text-6xl font-black text-ink dark:text-zinc-100 tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-muted dark:text-zinc-400 font-bold max-w-md mb-8 leading-relaxed">
        The flash deal you are looking for has expired, or the location was deleted. Try going back home.
      </p>
      <Link
        to="/"
        className="px-6 py-4 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all"
      >
        Return to Aisle 1
      </Link>
    </main>
  );
}
