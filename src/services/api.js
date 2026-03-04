import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMe: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const eventService = {
  getAll: async (type) => {
    try {
      const response = await api.get('/events', { params: { type } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const arenaService = {
  getAll: async () => {
    try {
      const response = await api.get('/arenas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getSeats: async (arenaId) => {
    try {
      const response = await api.get(`/arenas/${arenaId}/seats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const bookingService = {
  book: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMyTickets: async () => {
    try {
      const response = await api.get('/my-tickets');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const stripeService = {
  getConfig: async () => {
    try {
      const response = await api.get('/stripe/config');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createPaymentIntent: async (eventId) => {
    try {
      const response = await api.post('/stripe/create-payment-intent', { event_id: eventId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
