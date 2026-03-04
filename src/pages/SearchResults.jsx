import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { eventService } from '../services/api.js';
import { MapPin, Calendar, Search, Music, Briefcase, ChevronRight } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getAll(type);
        setEvents(data);
      } catch (err) {
        setError("Erreur lors de la récupération des résultats.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [type]);

  return (
    <div>
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white border border-gray-200 p-2 flex flex-col md:flex-row shadow-sm max-w-5xl mx-auto">
            <div className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-4 text-left">
              <MapPin size={20} className="text-violet-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Lieu</p>
                <input type="text" placeholder="Ville ou code postal" className="focus:outline-none w-full font-medium" />
              </div>
            </div>
            
            <div className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-4 text-left">
              <Calendar size={20} className="text-violet-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Date</p>
                <input type="text" placeholder="Toutes les dates" className="focus:outline-none w-full font-medium" />
              </div>
            </div>
            
            <div className="flex-1 px-6 py-4 flex items-center gap-4 text-left">
              <Search size={20} className="text-violet-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Événement</p>
                <input type="text" placeholder="Tout les événements" defaultValue={type || ''} className="focus:outline-none w-full font-medium" />
              </div>
            </div>
            
            <button className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors">
              Chercher
            </button>
          </div>
        </div>
      </div>

      <section className="py-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Concerts / Résultats</p>
            <h2 className="text-4xl font-title font-bold uppercase tracking-tight">{events.length} {type || 'concerts'} trouvés</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 border border-red-100">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-violet-50 text-violet-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        {event.type || 'LOREM , LOREM-IPSUM'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {event.start_time ? new Date(event.start_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '12 Février 2026'}
                    </p>
                    <h3 className="text-2xl font-title font-bold mb-6 leading-tight">
                      {event.title}
                    </h3>
                    
                    <button className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 border border-gray-100 px-3 py-2 mb-8 hover:bg-gray-50">
                      <span>▼</span> Avantages partenaires
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <svg width="24px" height="24px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Spotify-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-200.000000, -460.000000)" fill="#00DA5A"> <path d="M238.16,481.36 C230.48,476.8 217.64,476.32 210.32,478.6 C209.12,478.96 207.92,478.24 207.56,477.16 C207.2,475.96 207.92,474.76 209,474.4 C217.52,471.88 231.56,472.36 240.44,477.64 C241.52,478.24 241.88,479.68 241.28,480.76 C240.68,481.6 239.24,481.96 238.16,481.36 M237.92,488.08 C237.32,488.92 236.24,489.28 235.4,488.68 C228.92,484.72 219.08,483.52 211.52,485.92 C210.56,486.16 209.48,485.68 209.24,484.72 C209,483.76 209.48,482.68 210.44,482.44 C219.2,479.8 230,481.12 237.44,485.68 C238.16,486.04 238.52,487.24 237.92,488.08 M235.04,494.68 C234.56,495.4 233.72,495.64 233,495.16 C227.36,491.68 220.28,490.96 211.88,492.88 C211.04,493.12 210.32,492.52 210.08,491.8 C209.84,490.96 210.44,490.24 211.16,490 C220.28,487.96 228.2,488.8 234.44,492.64 C235.28,493 235.4,493.96 235.04,494.68 M224,460 C210.8,460 200,470.8 200,484 C200,497.2 210.8,508 224,508 C237.2,508 248,497.2 248,484 C248,470.8 237.32,460 224,460" id="Spotify"> </path> </g> </g> </g></svg>
                      <span>Spotify Advantages</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
                      <svg width="24px" height="24px" viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#006FCF" stroke="#F3F3F3"></rect> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8632 28.8937V20.6592H21.1869L22.1872 21.8787L23.2206 20.6592H57.0632V28.3258C57.0632 28.3258 56.1782 28.8855 55.1546 28.8937H36.4152L35.2874 27.5957V28.8937H31.5916V26.6779C31.5916 26.6779 31.0867 26.9872 29.9953 26.9872H28.7373V28.8937H23.1415L22.1426 27.6481L21.1284 28.8937H11.8632ZM1 14.4529L3.09775 9.86914H6.7256L7.9161 12.4368V9.86914H12.4258L13.1346 11.7249L13.8216 9.86914H34.0657V10.8021C34.0657 10.8021 35.1299 9.86914 36.8789 9.86914L43.4474 9.89066L44.6173 12.4247V9.86914H48.3913L49.43 11.3247V9.86914H53.2386V18.1037H49.43L48.4346 16.6434V18.1037H42.8898L42.3321 16.8056H40.8415L40.293 18.1037H36.5327C35.0277 18.1037 34.0657 17.1897 34.0657 17.1897V18.1037H28.3961L27.2708 16.8056V18.1037H6.18816L5.63093 16.8056H4.14505L3.59176 18.1037H1V14.4529ZM1.01082 17.05L3.84023 10.8843H5.98528L8.81199 17.05H6.92932L6.40997 15.8154H3.37498L2.85291 17.05H1.01082ZM5.81217 14.4768L4.88706 12.3192L3.95925 14.4768H5.81217ZM9.00675 17.049V10.8832L11.6245 10.8924L13.147 14.8676L14.6331 10.8832H17.2299V17.049H15.5853V12.5058L13.8419 17.049H12.3996L10.6514 12.5058V17.049H9.00675ZM18.3552 17.049V10.8832H23.7219V12.2624H20.0171V13.3171H23.6353V14.6151H20.0171V15.7104H23.7219V17.049H18.3552ZM24.674 17.05V10.8843H28.3339C29.5465 10.8843 30.6331 11.5871 30.6331 12.8846C30.6331 13.9938 29.717 14.7082 28.8289 14.7784L30.9929 17.05H28.9831L27.0111 14.8596H26.3186V17.05H24.674ZM28.1986 12.2635H26.3186V13.5615H28.223C28.5526 13.5615 28.9776 13.3221 28.9776 12.9125C28.9776 12.5941 28.6496 12.2635 28.1986 12.2635ZM32.9837 17.049H31.3045V10.8832H32.9837V17.049ZM36.9655 17.049H36.603C34.8492 17.049 33.7844 15.754 33.7844 13.9915C33.7844 12.1854 34.8373 10.8832 37.052 10.8832H38.8698V12.3436H36.9856C36.0865 12.3436 35.4507 13.0012 35.4507 14.0067C35.4507 15.2008 36.1777 15.7023 37.2251 15.7023H37.6579L36.9655 17.049ZM37.7147 17.05L40.5441 10.8843H42.6892L45.5159 17.05H43.6332L43.1139 15.8154H40.0789L39.5568 17.05H37.7147ZM42.5161 14.4768L41.591 12.3192L40.6632 14.4768H42.5161ZM45.708 17.049V10.8832H47.7989L50.4687 14.7571V10.8832H52.1134V17.049H50.09L47.3526 13.0737V17.049H45.708ZM12.9885 27.8391V21.6733H18.3552V23.0525H14.6504V24.1072H18.2686V25.4052H14.6504V26.5005H18.3552V27.8391H12.9885ZM39.2853 27.8391V21.6733H44.6519V23.0525H40.9472V24.1072H44.5481V25.4052H40.9472V26.5005H44.6519V27.8391H39.2853ZM18.5635 27.8391L21.1765 24.7942L18.5012 21.6733H20.5733L22.1665 23.6026L23.7651 21.6733H25.756L23.1159 24.7562L25.7338 27.8391H23.6621L22.1151 25.9402L20.6057 27.8391H18.5635ZM25.9291 27.8401V21.6744H29.5619C31.0525 21.6744 31.9234 22.5748 31.9234 23.7482C31.9234 25.1647 30.8131 25.893 29.3482 25.893H27.617V27.8401H25.9291ZM29.4402 23.0687H27.617V24.4885H29.4348C29.9151 24.4885 30.2517 24.1901 30.2517 23.7786C30.2517 23.3406 29.9134 23.0687 29.4402 23.0687ZM32.6375 27.8391V21.6733H36.2973C37.51 21.6733 38.5966 22.3761 38.5966 23.6736C38.5966 24.7828 37.6805 25.4972 36.7923 25.5675L38.9563 27.8391H36.9465L34.9746 25.6486H34.2821V27.8391H32.6375ZM36.1621 23.0525H34.2821V24.3505H36.1864C36.5161 24.3505 36.9411 24.1112 36.9411 23.7015C36.9411 23.3831 36.6131 23.0525 36.1621 23.0525ZM45.4137 27.8391V26.5005H48.7051C49.1921 26.5005 49.403 26.2538 49.403 25.9833C49.403 25.7241 49.1928 25.462 48.7051 25.462H47.2177C45.9249 25.462 45.2048 24.7237 45.2048 23.6153C45.2048 22.6267 45.8642 21.6733 47.7854 21.6733H50.9881L50.2956 23.0606H47.5257C46.9962 23.0606 46.8332 23.321 46.8332 23.5697C46.8332 23.8253 47.0347 24.1072 47.4392 24.1072H48.9972C50.4384 24.1072 51.0638 24.8734 51.0638 25.8768C51.0638 26.9555 50.367 27.8391 48.9188 27.8391H45.4137ZM51.2088 27.8391V26.5005H54.5002C54.9873 26.5005 55.1981 26.2538 55.1981 25.9833C55.1981 25.7241 54.9879 25.462 54.5002 25.462H53.0129C51.72 25.462 51 24.7237 51 23.6153C51 22.6267 51.6594 21.6733 53.5806 21.6733H56.7833L56.0908 23.0606H53.3209C52.7914 23.0606 52.6284 23.321 52.6284 23.5697C52.6284 23.8253 52.8298 24.1072 53.2343 24.1072H54.7924C56.2336 24.1072 56.859 24.8734 56.859 25.8768C56.859 26.9555 56.1621 27.8391 54.7139 27.8391H51.2088Z" fill="white"></path> </g></svg>
                      <span>Amex Advantages</span>
                    </div>
                    
                    <Link to={`/event/${event.id}`} className="bg-black text-white w-full py-4 px-6 flex justify-between items-center font-bold uppercase tracking-widest text-xs">
                      <span>Billetterie</span>
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 font-medium border-2 border-dashed border-gray-200">
                  Aucun événement trouvé pour cette catégorie.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
