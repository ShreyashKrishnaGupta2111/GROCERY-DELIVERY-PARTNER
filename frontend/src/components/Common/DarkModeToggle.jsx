import React from 'react';
import { useLocation } from '../../hooks/useLocation';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useLocation();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className="p-2.5 rounded-xl bg-ink dark:bg-brand text-brand dark:text-ink hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-md border border-white/5"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
    </button>
  );
}
