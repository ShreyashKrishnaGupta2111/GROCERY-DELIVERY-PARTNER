import React from 'react';

export default function About() {
  return (
    <main className="w-11/12 max-w-[1180px] mx-auto py-16 space-y-12">
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <p className="text-xs text-green font-black uppercase tracking-widest">About FlashBasket</p>
        <h1 className="text-4xl md:text-6xl font-black text-ink dark:text-zinc-100 tracking-tight leading-tight">
          Supercharged delivery at your fingertips.
        </h1>
        <p className="text-base text-muted dark:text-zinc-400 font-bold leading-relaxed">
          We combine advanced geographical clustering and local merchant network routing to deliver groceries to your door in under 10 minutes.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-zinc-800 p-8 md:p-12 rounded-[40px] shadow-premium border border-ink/5 dark:border-white/5 transition-colors">
        <div className="space-y-6">
          <p className="text-xs text-green font-black uppercase tracking-wider">The Technology</p>
          <h2 className="text-3xl font-black text-ink dark:text-zinc-100 leading-tight">
            Designed for sub-mile efficiency.
          </h2>
          <p className="text-sm text-muted dark:text-zinc-400 font-bold leading-relaxed">
            By mapping dark store delivery hubs and matching them with real-time location queries, our dispatch servers keep transit times low and produce zero-waste routes.
          </p>
          <ul className="space-y-3 font-black text-sm text-ink dark:text-zinc-300">
            <li className="flex items-center gap-2">✅ Geocoded delivery circles</li>
            <li className="flex items-center gap-2">✅ In-memory route dispatch routing</li>
            <li className="flex items-center gap-2">✅ Automatic offline cache recovery</li>
          </ul>
        </div>
        <div className="bg-brand rounded-[32px] p-8 flex flex-col justify-between min-h-[300px] shadow-[0_12px_44px_rgba(247,215,0,0.25)] select-none">
          <span className="text-5xl">⚡</span>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-ink">10 min avg delivery</h3>
            <p className="text-xs text-ink/75 font-bold leading-relaxed">
              Serving central NCR with lightning-fast delivery hubs located in Dwarka, Connaught Place, and Noida.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
