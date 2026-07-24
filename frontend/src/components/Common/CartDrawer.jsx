import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../hooks/useLocation';
import { formatPrice } from '../../utils/helpers';
import api from '../../services/api';
import { X, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    location,
    showToast
  } = useLocation();

  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    navigate('/payment', {
      state: {
        cart,
        total: totalPrice,
        address: location.address
      }
    });
  };


  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-40 bg-ink/40 dark:bg-black/60 transition-opacity duration-300 pointer-events-auto"
      />

      {/* Drawer */}
      <aside 
        className="fixed right-0 top-0 z-50 w-full sm:w-[400px] h-full bg-cream dark:bg-zinc-900 shadow-premium p-6 flex flex-col transition-transform duration-300 translate-x-0"
        aria-label="Shopping cart"
      >
        <div className="flex justify-between items-center pb-4 border-b border-ink/5 dark:border-white/5 mb-4">
          <h2 className="text-xl font-black text-ink dark:text-zinc-100 flex items-center gap-2">
            <ShoppingBag size={22} className="stroke-[2.5]" />
            Your flash cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full bg-ink text-white hover:scale-105 active:scale-95 transition-transform flex items-center justify-center font-bold"
            aria-label="Close cart"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted select-none">
              <span className="text-5xl mb-2">⚡</span>
              <p className="font-extrabold text-sm dark:text-zinc-400">Your cart is waiting for a lightning deal</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.name}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-ink/5 dark:border-white/5 font-extrabold flex justify-between items-center gap-4"
              >
                <div>
                  <div className="text-base text-ink dark:text-white flex items-center gap-1.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-xs text-muted dark:text-zinc-400 mt-1 block">
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-black text-ink dark:text-white">
                    {formatPrice(item.quantity * item.price)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.name, -1)}
                      className="w-7 h-7 rounded-full bg-brand text-ink hover:scale-105 active:scale-95 flex items-center justify-center font-black text-lg transition-transform"
                    >
                      −
                    </button>
                    <span className="text-xs dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.name, 1)}
                      className="w-7 h-7 rounded-full bg-brand text-ink hover:scale-105 active:scale-95 flex items-center justify-center font-black text-lg transition-transform"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.name)}
                      className="text-xs text-red-500 hover:underline font-extrabold ml-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-ink/5 dark:border-white/5 mt-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-black text-ink dark:text-white">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-4 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {checkingOut ? 'Placing order...' : 'Place exciting order 🚀'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
