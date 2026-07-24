import React from 'react';
import { useLocation } from '../../hooks/useLocation';

export default function Toast() {
  const { toasts } = useLocation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-6 py-4 rounded-full bg-ink text-lime font-black shadow-premium border border-white/10 animate-bounce duration-300 text-center select-none"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
