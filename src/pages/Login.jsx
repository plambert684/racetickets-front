import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-title font-bold uppercase tracking-tight">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Ou{' '}
            <Link to="/register" className="text-violet-600 font-bold hover:underline">
              créez un compte gratuitement
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 text-sm font-medium">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Email</label>
              <input
                type="email"
                required
                className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Mot de passe</label>
              <input
                type="password"
                required
                className="w-full border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
