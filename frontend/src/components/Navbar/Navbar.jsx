import React from 'react';
import { Link, useLocation as useRouteLocation } from 'react-router-dom';
import { useLocation } from '../../hooks/useLocation';
import DarkModeToggle from '../Common/DarkModeToggle';

export default function Navbar() {
  const { cart, setIsCartOpen } = useLocation();
  const routeLocation = useRouteLocation();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => {
    return routeLocation.pathname === path ? 'text-ink dark:text-brand font-black' : 'text-muted hover:text-ink dark:text-zinc-400 dark:hover:text-white font-extrabold';
  };

  return (
    <header className="sticky top-0 z-30 bg-cream/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-ink/8 dark:border-white/5 py-4 transition-colors">
      <nav className="w-11/12 max-w-[1180px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-lg font-black text-ink dark:text-white group select-none">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand group-hover:rotate-6 transition-transform shadow-[0_4px_0_#161f0f] dark:shadow-none text-xl">
            ⚡
          </span>
          <span className="tracking-tight text-xl">FlashBasket</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`${isActive('/')} transition-colors`}>Home</Link>
          <Link to="/search" className={`${isActive('/search')} transition-colors`}>Find Groceries</Link>
          <Link to="/about" className={`${isActive('/about')} transition-colors`}>About</Link>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          
          <button
            onClick={() => setIsCartOpen(true)}
            type="button"
            className="px-4 py-2.5 bg-ink dark:bg-zinc-800 text-white rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 shadow-md border border-white/5"
          >
            🛒 Cart 
            <span className="inline-grid place-items-center min-width-[20px] h-5 px-1.5 rounded-full bg-brand text-ink text-xs font-black">
              {totalItems}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
