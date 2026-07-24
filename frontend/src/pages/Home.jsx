import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../hooks/useLocation';
import { PRODUCTS } from '../utils/constants';
import { formatPrice, calculateDistance } from '../utils/helpers';
import SearchBar from '../components/SearchBar/SearchBar';
import Map from '../components/Map/Map';

export default function Home() {
  const navigate = useNavigate();
  const { location, addToCart, showToast } = useLocation();

  const hubDistance = (location && location.lat && location.lng)
    ? calculateDistance(28.6139, 77.209, location.lat, location.lng)
    : null;

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get matching products
  const visibleProducts = PRODUCTS.filter((product) => {
    const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
    const searchable = `${product.name} ${product.detail} ${product.category}`.toLowerCase();
    return matchesFilter && searchable.includes(searchTerm.toLowerCase());
  });

  const handleSelectLocation = () => {
    // Redirect to search view
    navigate('/search');
  };

  return (
    <main className="w-full pb-16 space-y-16 transition-colors">
      {/* 1. Hero Section */}
      <section className="w-11/12 max-w-[1180px] mx-auto pt-16 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-xs text-green font-black uppercase tracking-widest leading-none">
            India-inspired grocery rush • Fresh in minutes
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-ink dark:text-zinc-100 tracking-tighter leading-[0.9] select-none">
            Groceries that arrive before your craving cools down.
          </h1>
          <p className="text-base md:text-lg text-muted dark:text-zinc-400 font-bold max-w-xl leading-relaxed">
            A polished quick-commerce storefront with curated aisles, transparent delivery updates,
            smart search, member-only savings, and delightful ordering moments.
          </p>

          {/* Location card form with Autocomplete */}
          <div className="space-y-3">
            <span className="block text-xs uppercase tracking-wider font-black text-ink dark:text-zinc-400">
              📍 Deliver to your doorstep
            </span>
            <SearchBar 
              placeholder="Enter your address (e.g. Sector 21, New Delhi)..." 
              onSelect={handleSelectLocation}
            />
          </div>

          {/* Product Search */}
          <div className="flex items-center gap-3 p-4 bg-white/90 dark:bg-zinc-800/90 border border-ink/8 dark:border-white/5 rounded-2xl shadow-subtle max-w-2xl">
            <span className="text-lg shrink-0">🔎</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search milk, bananas, chips, cleaning essentials..."
              className="w-full bg-transparent border-0 outline-none text-ink dark:text-white font-extrabold text-sm placeholder:text-muted dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#deals" className="px-5 py-3.5 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all text-sm">
              Shop lightning deals
            </a>
            <a href="#categories" className="px-5 py-3.5 bg-white dark:bg-zinc-800 text-ink dark:text-zinc-100 border border-ink/12 dark:border-white/5 rounded-full font-black text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
              Explore aisles
            </a>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-black text-muted dark:text-zinc-400">
            <span>⏱ 10 min average</span>
            <span>•</span>
            <span>🥬 Farm-fresh picks</span>
            <span>•</span>
            <span>💳 UPI & cards</span>
            <span>•</span>
            <span>⭐ 4.9 customer love</span>
            <span>•</span>
            <span>🗺 Live map enabled</span>
          </div>
        </div>

        {/* Hero Interactive Panel */}
        <div className="relative min-h-[460px] sm:min-h-[520px] rounded-[44px] bg-gradient-to-br from-brand to-[#ffef70] dark:from-zinc-800 dark:to-zinc-900 shadow-premium overflow-hidden p-8 flex flex-col justify-between border border-white/10">
          <div className="flex justify-between items-start">
            <span className="inline-block px-4 py-2.5 rounded-full bg-ink dark:bg-brand text-lime dark:text-ink font-black text-xs uppercase tracking-wider animate-pulse-slow">
              LIVE ORDERS
            </span>
          </div>

          {/* Floating Rider status card */}
          <div className="absolute right-8 top-24 flex gap-4 items-center w-80 max-w-[calc(100%-64px)] p-4.5 rounded-[28px] bg-white dark:bg-zinc-800 shadow-premium border border-ink/5 dark:border-white/5">
            <span className="text-4xl">🛵</span>
            <div>
              <p className="text-xs text-muted dark:text-zinc-400 font-bold m-0">Order #FB2048</p>
              <strong className="block text-xl font-black text-ink dark:text-zinc-100 my-0.5">Arriving in 07:42</strong>
              <span className="text-xs text-muted dark:text-zinc-400 font-medium truncate block max-w-[200px]">Milk, bananas, chips, ice cream</span>
            </div>
          </div>

          {/* Floating Basket core */}
          <div className="relative w-full h-80 rounded-[38px] bg-white/40 dark:bg-white/5 border border-white/70 dark:border-white/10 overflow-hidden flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-ink dark:bg-zinc-950 text-white flex flex-col items-center justify-center text-center font-black text-sm select-none shadow-premium z-10">
              <span>Basket</span>
              <strong className="text-brand">filled fast</strong>
            </div>

            {/* Float items */}
            <span className="absolute text-5xl animate-float-delay-0 left-8 top-10 select-none">🥛</span>
            <span className="absolute text-5xl animate-float-delay-1 right-8 top-8 select-none">🍌</span>
            <span className="absolute text-5xl animate-float-delay-2 left-12 bottom-10 select-none">🥬</span>
            <span className="absolute text-5xl animate-float-delay-3 right-12 bottom-12 select-none">🍦</span>
          </div>
        </div>
      </section>

      {/* 2. Stats Strip */}
      <section className="w-11/12 max-w-[1180px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { stat: "30k+", label: "orders today" },
          { stat: "97%", label: "on-time delivery" },
          { stat: "1,200+", label: "fresh SKUs" },
          { stat: "24/7", label: "support desk" }
        ].map((item, idx) => (
          <article key={idx} className="p-6 rounded-[26px] bg-white/80 dark:bg-zinc-800/80 border border-ink/8 dark:border-white/5 shadow-subtle hover:scale-[1.02] transition-all">
            <strong className="block text-3xl font-black text-ink dark:text-zinc-100 tracking-tight leading-none">
              {item.stat}
            </strong>
            <span className="text-[10px] text-muted dark:text-zinc-400 font-black uppercase tracking-wider block mt-2">
              {item.label}
            </span>
          </article>
        ))}
      </section>

      {/* 3. Offer Ticker */}
      <section className="overflow-hidden py-4.5 bg-ink dark:bg-zinc-950 text-lime dark:text-brand font-black text-sm select-none border-y border-white/5">
        <div className="flex gap-12 w-max animate-marquee">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <span>🔥 Mega saver hour is live</span>
              <span>⚡ 10-minute essentials</span>
              <span>🎁 Free treat on orders over ₹499</span>
              <span>🥭 Fresh mangoes dropped today</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4. Categories Section */}
      <section className="w-11/12 max-w-[1180px] mx-auto py-8 space-y-6" id="categories">
        <div className="space-y-2">
          <p className="text-xs text-green font-black uppercase tracking-widest leading-none">Shop by mood</p>
          <h2 className="text-3xl md:text-5xl font-black text-ink dark:text-zinc-100 tracking-tight leading-tight">
            Every aisle, made exciting.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: "🥛", title: "Dairy & breakfast", text: "Fresh milk, eggs, bread and butter.", bg: "bg-[#fff4a1] dark:bg-yellow-950/20" },
            { emoji: "🥦", title: "Fruits & veggies", text: "Daily-picked produce with crisp quality.", bg: "bg-[#dfffdc] dark:bg-green-950/20" },
            { emoji: "🍫", title: "Snacks & cravings", text: "Chips, chocolate, popcorn and party packs.", bg: "bg-[#ffe3ee] dark:bg-pink-950/20" },
            { emoji: "🧴", title: "Home essentials", text: "Cleaning, personal care and daily staples.", bg: "bg-[#dff3ff] dark:bg-blue-950/20" }
          ].map((cat, idx) => (
            <article key={idx} className={`p-6 rounded-[30px] shadow-subtle ${cat.bg} border border-ink/5 dark:border-white/5 space-y-3 flex flex-col justify-between min-h-[160px]`}>
              <span className="text-4xl">{cat.emoji}</span>
              <div>
                <h3 className="text-base font-black text-ink dark:text-zinc-100 leading-tight mb-1">{cat.title}</h3>
                <p className="text-xs text-muted dark:text-zinc-400 font-bold leading-normal">{cat.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Map Section */}
      <section className="w-11/12 max-w-[1180px] mx-auto py-8 space-y-6" id="delivery-map">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <p className="text-xs text-green font-black uppercase tracking-widest leading-none">Delivery intelligence</p>
            <h2 className="text-3xl md:text-5xl font-black text-ink dark:text-zinc-100 tracking-tight leading-tight">
              See your service area before you order.
            </h2>
          </div>
          <button 
            onClick={handleSelectLocation}
            className="px-5 py-3 bg-white dark:bg-zinc-800 text-ink dark:text-zinc-100 border border-ink/12 dark:border-white/5 rounded-full font-black text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all shadow-md shrink-0"
          >
            Open Store Finder 🗺
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 h-[450px]">
            <Map />
          </div>
          <aside className="p-8 rounded-[34px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 shadow-subtle flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-ink dark:text-zinc-100 leading-tight">Fast zone preview</h3>
              <p className="text-sm text-muted dark:text-zinc-400 font-bold leading-relaxed">
                We center the map on New Delhi by default and highlight a 4 km quick-delivery zone.
              </p>
              
              {/* Delivery distance status */}
              <div className="p-4.5 rounded-2xl bg-brand/10 dark:bg-zinc-900 border border-brand/20 dark:border-white/5 space-y-2">
                <span className="block text-[10px] uppercase tracking-wider font-black text-ink dark:text-zinc-300">
                  📍 Delivery Distance Status
                </span>
                <p className="text-xs text-muted dark:text-zinc-400 font-bold">
                  Selected: <span className="text-ink dark:text-zinc-200 font-black">{location?.address?.split(',')[0] || 'Default Center'}</span>
                </p>
                {hubDistance !== null ? (
                  <div className="space-y-1">
                    <p className="text-xs font-black text-ink dark:text-zinc-100">
                      Distance to Hub: <span className="text-brand-strong dark:text-brand font-black">{hubDistance.toFixed(2)} km</span>
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      hubDistance <= 4 ? 'bg-green/20 text-green' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {hubDistance <= 4 ? '✓ Eligible for 10-Min Delivery' : '✗ Outside Free Zone'}
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted font-bold">Please select an address above to verify distance.</p>
                )}
              </div>

              <ul className="space-y-3 font-bold text-xs text-muted dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-green text-sm">✓</span>
                  <span>Secure key comes from the backend config endpoint.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green text-sm">✓</span>
                  <span>Checkout sends orders to the backend order API.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green text-sm">✓</span>
                  <span>Use Google Cloud restrictions before production.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* 6. Deals Section */}
      <section className="w-11/12 max-w-[1180px] mx-auto py-8 space-y-6" id="deals">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <p className="text-xs text-green font-black uppercase tracking-widest leading-none">Add to cart now</p>
            <h2 className="text-3xl md:text-5xl font-black text-ink dark:text-zinc-100 tracking-tight leading-tight">
              Lightning deals that create a queue.
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {['all', 'fresh', 'snacks', 'home'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
              className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider border transition-all ${
                activeFilter === filter
                  ? 'bg-ink dark:bg-brand text-lime dark:text-ink border-ink dark:border-brand shadow-[0_6px_0_#f7d700]'
                  : 'bg-white dark:bg-zinc-800 text-muted dark:text-zinc-400 border-ink/10 dark:border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="relative p-6 rounded-[30px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 hover:border-brand/40 dark:hover:border-brand/40 hover:-translate-y-2 hover:-rotate-1 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between min-h-[220px] group"
              >
                {product.tag && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-red-500 text-white font-black text-[9px] uppercase tracking-wider z-10 shadow-sm">
                    {product.tag}
                  </span>
                )}

                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">{product.emoji}</div>
                
                <div className="space-y-1">
                  <h3 className="text-base font-black text-ink dark:text-zinc-100 leading-tight">{product.name}</h3>
                  <p className="text-xs text-muted dark:text-zinc-400 font-bold">{product.detail}</p>
                  
                  <div className="flex gap-1.5 flex-wrap pt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-muted dark:text-zinc-400 font-black text-[9px] uppercase">
                      ⏱ {product.eta}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-muted dark:text-zinc-400 font-black text-[9px] uppercase">
                      ⭐ {product.rating}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-ink/5 dark:border-white/5">
                  <span className="text-base font-black text-ink dark:text-zinc-100">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 bg-brand text-ink font-black rounded-xl shadow-[0_4px_0_#c99600] hover:translate-y-[1px] hover:shadow-[0_3px_0_#c99600] active:translate-y-[4px] active:shadow-none transition-all text-xs"
                    type="button"
                  >
                    ADD +
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center bg-white dark:bg-zinc-800 rounded-3xl font-extrabold text-sm border border-ink/5 dark:border-white/5 text-muted dark:text-zinc-400 shadow-sm select-none">
            No matching groceries yet. Try another craving.
          </p>
        )}
      </section>

      {/* 7. How it works Section */}
      <section className="w-11/12 max-w-[1180px] mx-auto py-8 space-y-6" id="how-it-works">
        <div className="space-y-2">
          <p className="text-xs text-green font-black uppercase tracking-widest leading-none">Built for speed</p>
          <h2 className="text-3xl md:text-5xl font-black text-ink dark:text-zinc-100 tracking-tight leading-tight">
            From tap to doorstep in three thrilling steps.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "Pick your cravings", text: "Browse bold aisles, trending bundles and daily essentials." },
            { step: 2, title: "Watch the basket buzz", text: "See animated cart feedback that makes ordering feel alive." },
            { step: 3, title: "Meet your rider", text: "Track a fast grocery run with live delivery messaging." }
          ].map((item, idx) => (
            <article key={idx} className="p-6 rounded-[30px] bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 shadow-subtle space-y-4 flex flex-col justify-between min-h-[160px]">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-brand text-ink text-lg font-black shadow-[0_4px_0_#17210f] dark:shadow-none">
                {item.step}
              </span>
              <div>
                <h3 className="text-base font-black text-ink dark:text-zinc-100 leading-tight mb-1">{item.title}</h3>
                <p className="text-xs text-muted dark:text-zinc-400 font-bold leading-normal">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Promise Card */}
      <section className="w-11/12 max-w-[1180px] mx-auto py-8" id="support">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-ink to-[#29401b] dark:from-zinc-950 dark:to-zinc-900 text-white shadow-premium border border-white/5 transition-colors">
          <div className="space-y-4">
            <p className="text-xs text-green font-black uppercase tracking-wider">Professional promise</p>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Premium convenience without the supermarket stress.
            </h2>
            <p className="text-sm text-[#dce9ce] dark:text-zinc-400 leading-relaxed font-bold">
              Priority packing, hygienic handling, real-time rider support, simple refunds, and clean product details make every order feel trustworthy.
            </p>
          </div>
          <div className="grid gap-3.5 align-content-center">
            {[
              "✅ Quality checked before dispatch",
              "🧊 Cold-chain friendly delivery",
              "💬 Instant chat support",
              "🔁 Easy replacements"
            ].map((promise, idx) => (
              <span key={idx} className="block p-4.5 rounded-2xl bg-white/10 dark:bg-white/5 font-black text-sm border border-white/5">
                {promise}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
