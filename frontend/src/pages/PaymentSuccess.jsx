import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { CheckCircle2, MapPin, Calendar, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve details passed from routing state
  const {
    orderId = `order_mock_${Math.random().toString(36).substring(2, 10)}`,
    paymentId = `pay_mock_${Date.now()}`,
    amount = 0,
    address = 'Sector 21, New Delhi',
    isMock = true
  } = location.state || {};

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full animate-fadeIn flex-1 flex flex-col justify-center items-center text-center">
      
      {/* Green Check Animation Container */}
      <div className="relative w-20 h-20 mb-6 bg-green/10 dark:bg-green/20 rounded-full flex items-center justify-center text-green border border-green/30">
        <CheckCircle2 size={44} className="stroke-[2.5] animate-pulse-slow text-green" />
      </div>

      {/* Success Title */}
      <h1 className="text-3xl font-black text-ink dark:text-zinc-100 tracking-tight">
        Order Placed! 🚀
      </h1>
      <p className="text-sm font-extrabold text-muted dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
        Your payment was verified. A rider is already preparing to deliver your fresh items!
      </p>

      {/* Mock Sandbox Notice */}
      {isMock && (
        <div className="mt-4 px-4 py-1.5 rounded-full bg-brand-light/40 dark:bg-brand/10 border border-brand/20 text-brand-strong text-[10px] font-black uppercase tracking-wider">
          ⚡ Sandbox Test Mode Active
        </div>
      )}

      {/* ETA Banner */}
      <div className="w-full mt-8 p-5 bg-gradient-to-br from-green/10 to-brand/10 dark:from-green/20 dark:to-brand/20 rounded-[34px] border border-green/20 text-ink dark:text-zinc-100 font-extrabold text-left space-y-1.5 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20 select-none">🏍️</div>
        <p className="text-xs uppercase tracking-wider text-muted dark:text-zinc-400 font-black">Estimated Delivery Time</p>
        <p className="text-2xl font-black text-green-dark dark:text-green">10 Minutes or Less!</p>
        <p className="text-xs text-muted dark:text-zinc-400 font-bold">Rider is assigned and dispatching from nearest hub.</p>
      </div>

      {/* Transaction Details Box */}
      <div className="w-full mt-6 p-6 bg-white dark:bg-zinc-900 border border-ink/5 dark:border-white/5 rounded-[34px] shadow-premium text-left text-xs font-bold text-muted dark:text-zinc-400 space-y-4">
        
        <div className="flex justify-between items-center pb-3 border-b border-ink/5 dark:border-white/5">
          <span className="flex items-center gap-1.5"><ShoppingBag size={14} /> Total Amount</span>
          <span className="text-sm font-black text-ink dark:text-white">{formatPrice(amount)}</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Payment ID</span>
            <span className="font-extrabold text-ink dark:text-zinc-200 font-mono">{paymentId}</span>
          </div>

          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-extrabold text-ink dark:text-zinc-200 font-mono">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span className="text-ink dark:text-zinc-200">{new Date().toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-1 pt-1.5">
            <span className="flex items-center gap-1"><MapPin size={12} /> Shipping Address:</span>
            <span className="text-ink dark:text-zinc-200 pl-4">{address}</span>
          </div>
        </div>

      </div>

      {/* Return Button */}
      <button
        onClick={() => navigate('/')}
        className="w-full mt-8 py-4 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Back to Storefront</span>
        <ArrowRight size={18} />
      </button>

    </div>
  );
}
