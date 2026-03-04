import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        role: 'user',
        profileData: {
          first_name: formData.first_name,
          last_name: formData.last_name
        }
      };
      
      await authService.register(userData);

      navigate('/login', { state: { message: "Inscription réussie ! Veuillez vous connecter." } });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-title font-bold uppercase tracking-tight">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Ou{' '}
            <Link to="/login" className="text-violet-600 font-bold hover:underline">
              connectez-vous à votre compte
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Prénom</label>
              <input
                name="first_name"
                type="text"
                required
                className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium text-sm"
                placeholder="Jean"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Nom</label>
              <input
                name="last_name"
                type="text"
                required
                className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium text-sm"
                placeholder="Dupont"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium text-sm"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Confirmer le mot de passe</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium text-sm"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Création..." : "S'inscrire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
