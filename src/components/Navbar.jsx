import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, MapPin } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2 text-xs text-gray-500 border-b border-gray-50 mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Paris, France</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium">{user.email}</span>
                <button onClick={logout} className="hover:text-black transition-colors">Déconnexion</button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-black transition-colors">
                <User size={14} />
                <span>Mon compte</span>
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="font-title font-extrabold text-2xl uppercase tracking-tighter">
            racetickets<span className="text-blue-500">.</span>
          </Link>
          
          <div className="flex gap-8 font-semibold text-sm uppercase tracking-wide">
            <Link to="/events?type=concert" className="hover:text-blue-500 transition-colors">Concerts</Link>
            <Link to="/events?type=evenement" className="hover:text-blue-500 transition-colors">Événements</Link>
            <Link to="/events?type=atelier" className="hover:text-blue-500 transition-colors">Ateliers</Link>
            {user && (
              <>
                <Link to="/my-tickets" className="hover:text-blue-500 transition-colors">Mes tickets</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-500 transition-colors text-red-500">Admin</Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
