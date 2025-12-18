import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingService } from '../api/services';
import { toast } from 'react-toastify';

const statusConfig = {
  processing: {
    title: 'Confirming your payment…',
    tone: 'text-blue-600',
    accent: 'bg-blue-100',
    emoji: '⏳'
  },
  success: {
    title: 'Payment successful!',
    tone: 'text-green-600',
    accent: 'bg-green-100',
    emoji: '🎉'
  },
  pending: {
    title: 'Payment pending',
    tone: 'text-amber-600',
    accent: 'bg-amber-100',
    emoji: '🕒'
  },
  cancelled: {
    title: 'Payment cancelled',
    tone: 'text-rose-600',
    accent: 'bg-rose-100',
    emoji: '⚠️'
  },
  error: {
    title: 'Unable to verify payment',
    tone: 'text-rose-600',
    accent: 'bg-rose-100',
    emoji: '🚫'
  }
};

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const cancelled = searchParams.get('cancelled');

  const [status, setStatus] = useState(cancelled ? 'cancelled' : 'processing');
  const [message, setMessage] = useState('Please wait while we confirm the payment with Stripe.');
  const [booking, setBooking] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const config = useMemo(() => statusConfig[status] || statusConfig.processing, [status]);
  const shouldAutoRedirect = useMemo(() => ['success', 'pending', 'cancelled'].includes(status), [status]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (cancelled) {
        setStatus('cancelled');
        setMessage('You cancelled the payment. The booking (if created) remains pending.');
        return;
      }

      if (!sessionId) {
        setStatus('error');
        setMessage('Missing payment reference.');
        return;
      }

      try {
        setStatus('processing');
        setMessage('Validating checkout session…');
        const response = await bookingService.verifyStripeSession(sessionId);
        setBooking(response.booking || null);

        if (response.success) {
          setStatus('success');
          setMessage('Payment confirmed! We are redirecting you to your bookings.');
          toast.success('Payment confirmed ✅');
        } else {
          setStatus('pending');
          setMessage('Stripe is still processing your payment. We will update your booking shortly.');
        }
      } catch (error) {
        console.error('Stripe verification error:', error);
        setStatus('error');
        const fallback = error.response?.data?.message || 'Unable to verify payment. Please check your bookings.';
        setMessage(fallback);
        toast.error(fallback);
      }
    };

    verifyPayment();
  }, [cancelled, sessionId]);

  useEffect(() => {
    if (!shouldAutoRedirect) {
      setIsRedirecting(false);
      return;
    }

    setIsRedirecting(true);
    const timer = setTimeout(() => {
      navigate('/my-bookings', { replace: true });
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [shouldAutoRedirect, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="absolute inset-0 -z-10 opacity-40 blur-3xl" style={{
        background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 50%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.25), transparent 45%)'
      }} />

      <div className="w-full max-w-xl rounded-3xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-white/60 dark:border-gray-800 p-10 text-center animate-fade-in">
        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl ${config.accent} shadow-inner`}>{config.emoji}</div>
        <h1 className={`text-3xl font-bold mb-3 ${config.tone}`}>{config.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>

        {(status === 'processing' || isRedirecting) && (
          <div className="mt-6 flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300">
            <span className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" aria-label="Loading" />
            <p className="text-sm">
              {isRedirecting ? 'Routing you to My Bookings…' : 'Hang tight while we finalize your payment.'}
            </p>
          </div>
        )}

        {booking && (
          <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-5 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Latest booking</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{booking.hotel?.name || 'QuickStay Hotel'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Room: {booking.room?.roomType || 'N/A'}</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Check-in</p>
                <p className="font-semibold text-gray-900 dark:text-white">{new Date(booking.checkInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Check-out</p>
                <p className="font-semibold text-gray-900 dark:text-white">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Guests</p>
                <p className="font-semibold text-gray-900 dark:text-white">{booking.guests}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total</p>
                <p className="font-semibold text-gray-900 dark:text-white">Rs {booking.totalPrice?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/my-bookings')}
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition-all disabled:opacity-70"
          disabled={status === 'processing'}
        >
          {isRedirecting && <span className="h-5 w-5 rounded-full border-2 border-white/50 border-t-white animate-spin" aria-hidden="true" />}
          Go to My Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
