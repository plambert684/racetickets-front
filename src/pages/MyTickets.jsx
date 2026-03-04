import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api.js';
import { Ticket, Calendar, MapPin, Download } from 'lucide-react';

const MyTickets = () => {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await bookingService.getMyTickets();
        setTickets(data);
      } catch (err) {
        setError("Impossible de charger vos tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-title font-bold uppercase tracking-tight mb-12">Mes Tickets</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 border border-red-100">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Vous n'avez pas encore de tickets.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-gray-200 flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">

                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-violet-50 text-violet-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      {ticket.type}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      ID: {ticket.ticket_code}
                    </div>
                  </div>
                  <h3 className="text-2xl font-title font-bold mb-6 leading-tight uppercase">
                    {ticket.event_title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar size={16} className="text-violet-500" />
                      <span>{ticket.start_time ? new Date(ticket.start_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date à venir'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin size={16} className="text-violet-500" />
                      <span>{ticket.arena_name || 'Lieu à confirmer'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Ticket size={16} className="text-violet-500" />
                      <span>Siège : {ticket.seat_number || 'Non assigné'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 min-w-[200px]">
                  <div className="w-24 h-24 bg-white border border-gray-200 mb-4 flex items-center justify-center">

                    <div className="grid grid-cols-4 gap-1 p-2">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-gray-100'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
