import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api.js';

const Admin = () => {

  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('evenement');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des événements", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (editingId) {
        await eventService.update(editingId, { title, description, type, price: parseFloat(price) });
        setMessage({ type: 'success', text: 'Événement mis à jour avec succès !' });
      } else {
        await eventService.create({ title, description, type, price: parseFloat(price) });
        setMessage({ type: 'success', text: 'Événement créé avec succès !' });
      }
      setTitle('');
      setDescription('');
      setType('evenement');
      setPrice('');
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de l\'opération.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description || '');
    setType(event.type);
    setPrice(event.price || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    try {
      await eventService.delete(id);
      fetchEvents();
      if (editingId === id) {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setType('evenement');
        setPrice('');
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setType('evenement');
    setPrice('');
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-title font-bold uppercase tracking-tight mb-12">Administration</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-title font-bold uppercase tracking-tight mb-8">
                {editingId ? "Modifier l'événement" : "Ajouter un Événement"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 text-xs font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Titre de l'événement</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium text-sm"
                    placeholder="ex: Concert de Rock"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Type</label>
                  <select 
                    className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium text-sm appearance-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="concert">Concert</option>
                    <option value="evenement">Événement</option>
                    <option value="atelier">Atelier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Prix (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium text-sm"
                    placeholder="ex: 49.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Description</label>
                  <textarea 
                    rows="4" 
                    className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium text-sm"
                    placeholder="Description de l'événement..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Chargement..." : editingId ? "Mettre à jour" : "Ajouter l'événement"}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={cancelEdit}
                      className="w-full bg-white border border-gray-200 text-gray-500 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Liste */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-xl font-title font-bold uppercase tracking-tight">Liste des Événements</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Événement</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Type</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-12 text-center text-gray-500 font-medium">Aucun événement trouvé</td>
                      </tr>
                    ) : (
                      events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900">{event.title}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">{event.type}</div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(event)}
                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors border border-gray-100 hover:border-blue-100"
                                title="Modifier"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(event.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 hover:border-red-100"
                                title="Supprimer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
