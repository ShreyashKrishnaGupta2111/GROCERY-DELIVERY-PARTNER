import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const reason = searchParams.get('reason') || 'unknown';
  const orderId = searchParams.get('orderId') || '';

  const getReasonDetails = () => {
    switch (reason) {
      case 'user_cancelled':
        return {
          title: 'Payment Cancelled 🛑',
          description: 'You closed the secure Razorpay payment window before the transaction completed.',
          tip: 'No money was debited. Please try again when you are ready to complete your purchase.'
        };
      case 'verification_failed':
        return {
          title: 'Verification Failed ⚠️',
          description: 'The transaction completed, but our system failed to cryptographically verify the payment signature.',
          tip: 'If money was debited from your account, it will automatically be refunded within 3-5 business days. Please contact support if the refund is not processed.'
        };
      default:
        return {
          title: 'Payment Failed ❌',
          description: 'The transaction was declined by your bank or card issuer.',
          tip: 'Please double-check your balance, check if online card payments are enabled, or try using another UPI app / debit card.'
        };
    }
  };

  const details = getReasonDetails();

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full animate-fadeIn flex-1 flex flex-col justify-center items-center text-center">
      
      {/* Red Error Animation Container */}
      <div className="relative w-20 h-20 mb-6 bg-red-500/10 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-500 border border-red-500/30">
        <AlertCircle size={44} className="stroke-[2.5] text-red-500" />
      </div>

      {/* Failure Title */}
      <h1 className="text-3xl font-black text-ink dark:text-zinc-100 tracking-tight">
        {details.title}
      </h1>
      <p className="text-sm font-extrabold text-muted dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
        {details.description}
      </p>

      {orderId && (
        <div className="mt-2 text-[10px] font-bold text-muted dark:text-zinc-500 font-mono">
          Order Reference: {orderId}
        </div>
      )}

      {/* Actionable tip box */}
      <div className="w-full mt-8 p-5 bg-zinc-50 dark:bg-zinc-900 border border-ink/5 dark:border-white/5 rounded-[34px] text-left text-xs font-bold text-muted dark:text-zinc-400 space-y-1">
        <p className="font-extrabold text-ink dark:text-zinc-200">💡 Helpful Tip</p>
        <p className="leading-relaxed font-semibold">{details.tip}</p>
      </div>

      {/* Actions */}
      <div className="w-full mt-8 space-y-3">
        <button
          onClick={() => navigate('/payment')}
          className="w-full py-4 bg-green hover:bg-green-dark text-white font-black rounded-full shadow-[0_8px_0_#157226] hover:translate-y-[2px] hover:shadow-[0_6px_0_#157226] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Try Payment Again</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-white dark:bg-zinc-800 text-ink dark:text-zinc-200 border border-ink/10 dark:border-white/10 font-black rounded-full shadow-md hover:translate-y-[2px] active:translate-y-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Cancel & Go Home</span>
        </button>
      </div>

      <div className="mt-6 text-[10px] font-extrabold text-muted dark:text-zinc-500 uppercase tracking-wider">
        Need assistance? Email support@flashbasket.demo
      </div>

    </div>
  );
}
