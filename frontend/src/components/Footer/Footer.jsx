import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink dark:bg-zinc-950 text-white py-12 transition-colors border-t border-white/5">
      <div className="w-11/12 max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-xl font-black">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand text-ink text-sm">
              ⚡
            </span>
            <span>FlashBasket</span>
          </div>
          <p className="text-zinc-400 text-sm max-w-sm font-medium">
            Groceries that arrive before your craving cools down. Experience India-inspired quick-commerce delivery.
          </p>
        </div>

        <div>
          <h3 className="font-black text-brand mb-4 text-sm uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-sm text-zinc-300 font-bold">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/search" className="hover:underline">Find Groceries</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-black text-brand mb-4 text-sm uppercase tracking-wider">Need help?</h3>
          <ul className="space-y-2 text-sm text-zinc-300 font-bold">
            <li><a href="#support" className="hover:underline">Instant chat support</a></li>
            <li><a href="#how-it-works" className="hover:underline">Delivery zone FAQ</a></li>
            <li><span className="text-xs text-zinc-500 font-extrabold">Call: 24/7 hotline support</span></li>
          </ul>
        </div>
      </div>
      
      <div className="w-11/12 max-w-[1180px] mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-zinc-500 font-extrabold">
        © {new Date().getFullYear()} FlashBasket Delivery Services Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
