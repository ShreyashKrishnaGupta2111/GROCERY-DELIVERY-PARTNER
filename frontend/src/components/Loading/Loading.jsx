import React from 'react';

export function StoreCardSkeleton() {
  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 shadow-subtle space-y-3 animate-pulse">
      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-3/4" />
      <div className="flex gap-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-12" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-16" />
      </div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-full" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/2" />
      <div className="flex gap-3 pt-2">
        <div className="h-9 bg-zinc-200 dark:bg-zinc-700 rounded-full w-24" />
        <div className="h-9 bg-zinc-200 dark:bg-zinc-700 rounded-full w-24" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="p-6 rounded-[30px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 shadow-subtle flex flex-col gap-3 animate-pulse">
      <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto" />
      <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-2/3 mx-auto" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/2 mx-auto" />
      <div className="flex gap-2 justify-center">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-10" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-10" />
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-md w-14" />
        <div className="h-9 bg-zinc-200 dark:bg-zinc-700 rounded-xl w-16" />
      </div>
    </div>
  );
}

export function Spinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div className={`${sizeClasses[size] || sizeClasses.medium} border-zinc-200 dark:border-zinc-700 border-t-brand rounded-full animate-spin`} />
    </div>
  );
}
