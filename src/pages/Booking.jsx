import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, bookingService, stripeService } from '../services/api.js';
import { io } from 'socket.io-client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext.jsx';
import { Calendar, MapPin, Ticket, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';

const CheckoutForm = ({ event, onBookingSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event_e) => {
    event_e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { clientSecret } = await stripeService.createPaymentIntent(event.id);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onBookingSuccess();
        }
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors du paiement.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 bg-gray-50 rounded">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      {error && (
        <div className="text-red-600 text-sm font-bold uppercase flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-5 font-bold uppercase tracking-widest text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <CreditCard size={24} />
        {processing ? "Traitement..." : `Payer ${event.price} €`}
      </button>
    </form>
  );
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [socket, setSocket] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const { publicKey } = await stripeService.getConfig();
        setStripePromise(loadStripe(publicKey));
      } catch (err) {
        console.error("Erreur chargement config Stripe", err);
      }
    };
    initStripe();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const events = await eventService.getAll();
        const found = events.find(e => e.id === parseInt(id));
        setEvent(found);
      } catch (err) {
        setError("Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [id]);

  const handleBookingSuccess = async () => {
    setBookingStatus({ type: 'loading', message: 'Finalisation de la réservation...' });
    try {
      const result = await bookingService.book({
        event_id: event.id,
        session_id: 1, 
        seat_id: 'A-' + Math.floor(Math.random() * 100)
      });
      setBookingStatus({ type: 'success', message: result.confirmation });
    } catch (err) {
      setBookingStatus({ type: 'error', message: err.message || "Erreur lors de la réservation." });
    }
  };

  const handleBookFree = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    handleBookingSuccess();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent" />
    </div>
  );
  if (!event) return (
    <div className="container mx-auto px-4 py-20 text-center font-title text-2xl font-bold uppercase">
      Événement non trouvé.
    </div>
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white border border-gray-200 flex flex-col lg:flex-row shadow-sm">
          <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col">
            <div className="mb-10">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 uppercase tracking-widest inline-block mb-4">
                {event.type}
              </span>
              <h2 className="text-4xl lg:text-5xl font-title font-bold uppercase tracking-tight mb-6 leading-tight">
                {event.title}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                {event.description || "Un événement exceptionnel à ne pas manquer. Profitez d'une expérience unique avec les meilleurs artistes et une ambiance inoubliable."}
              </p>
            </div>
            
            <div className="space-y-4 mb-10 border-y border-gray-100 py-8">
              <div className="flex items-center gap-4 text-gray-600 font-semibold text-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-blue-500">
                  <Calendar size={20} />
                </div>
                <span>{event.start_time ? new Date(event.start_time).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "12 Février 2026 à 20:00"}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 font-semibold text-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-blue-500">
                  <MapPin size={20} />
                </div>
                <span>{event.arena_name || "Stade de France, Paris"}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 font-semibold text-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-blue-500">
                  <Ticket size={20} />
                </div>
                <span>Billet standard - Placement libre</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 font-semibold text-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-blue-500">
                  <CreditCard size={20} />
                </div>
                <span>Prix : {event.price ? `${event.price} €` : "Gratuit"}</span>
              </div>
            </div>

            {bookingStatus && (
              <div className={`mb-8 p-4 flex items-start space-x-3 text-sm font-bold uppercase tracking-wide border ${
                bookingStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 
                bookingStatus.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'
              }`}>
                {bookingStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p>{bookingStatus.message}</p>
              </div>
            )}

            <div className="mt-auto space-y-4">
              {event.price > 0 ? (
                stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm event={event} onBookingSuccess={handleBookingSuccess} />
                  </Elements>
                ) : (
                  <div className="animate-pulse bg-gray-100 h-12 rounded" />
                )
              ) : (
                <button 
                  onClick={handleBookFree}
                  disabled={bookingStatus?.type === 'loading'}
                  className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {bookingStatus?.type === 'loading' ? "Chargement..." : "Réserver ma place"}
                </button>
              )}
              
              <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                Confirmation immédiate par email & SMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
