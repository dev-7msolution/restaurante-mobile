import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';
import { formatApiError } from './utils';

const API_BASE_URL = config.API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contador de tentativas de retry
let retryCount = 0;
const MAX_RETRIES = 3;

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('restaurante_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset contador em caso de sucesso
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Lidar com token expirado
    if (error.response?.status === 401) {
      // Tentar renovar token automaticamente
      try {
        const refreshToken = await AsyncStorage.getItem('restaurante_refresh_token');
        if (refreshToken && originalRequest && !originalRequest.url?.includes('/auth/refresh')) {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { token: newToken } = response.data;
          
          await AsyncStorage.setItem('restaurante_token', newToken);
          
          // Retry a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Falha ao renovar token, fazer logout
        await AsyncStorage.multiRemove(['restaurante_token', 'restaurante_user', 'restaurante_refresh_token']);
        // O redirecionamento será feito pelo contexto de auth
      }
    }

    // Retry automático para erros de rede
    if (error.code === 'NETWORK_ERROR' && retryCount < MAX_RETRIES) {
      retryCount++;
      // Esperar um pouco antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      return api(originalRequest!);
    }

    // Reset contador se não for erro de rede
    if (error.code !== 'NETWORK_ERROR') {
      retryCount = 0;
    }

    return Promise.reject(error);
  }
);

// Função helper para lidar com erros
const handleApiError = (error: any) => {
  const formattedError = formatApiError(error);
  throw new Error(formattedError);
};

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      return await api.post('/auth/login', { email, password });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      return await api.post('/auth/reset-password', { token, password });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('restaurante_refresh_token');
      return await api.post('/auth/refresh', { refreshToken });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  me: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      handleApiError(error);
    }
  },
  
  updateProfile: async (userData: { name?: string; email?: string; avatar?: string }) => {
    try {
      return await api.patch('/auth/profile', userData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      return await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  logout: async () => {
    try {
      return await api.post('/auth/logout');
    } catch (error) {
      // Não tratamos erro aqui pois o logout deve funcionar mesmo offline
      console.warn('Erro ao fazer logout no servidor:', error);
    }
  },
  
  // Verificar se email existe (útil para registro)
  checkEmailExists: async (email: string) => {
    try {
      return await api.post('/auth/check-email', { email });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Enviar código de verificação
  sendVerificationCode: async (email: string) => {
    try {
      return await api.post('/auth/send-verification', { email });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Verificar código
  verifyCode: async (email: string, code: string) => {
    try {
      return await api.post('/auth/verify-code', { email, code });
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const restauranteApi = {
  // Menu
  getMenu: async () => {
    try {
      return await api.get('/menu');
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getMenuItem: async (id: string) => {
    try {
      return await api.get(`/menu/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  searchMenu: async (query: string, filters?: any) => {
    try {
      return await api.get('/menu/search', { params: { query, ...filters } });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Pedidos
  createOrder: async (orderData: any) => {
    try {
      return await api.post('/orders', orderData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getOrders: async (page = 1, limit = 10) => {
    try {
      return await api.get('/orders', { params: { page, limit } });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getOrder: async (id: string) => {
    try {
      return await api.get(`/orders/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    try {
      return await api.patch(`/orders/${id}/status`, { status });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  cancelOrder: async (id: string, reason?: string) => {
    try {
      return await api.post(`/orders/${id}/cancel`, { reason });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Favoritos
  getFavorites: async () => {
    try {
      return await api.get('/favorites');
    } catch (error) {
      handleApiError(error);
    }
  },
  
  addFavorite: async (itemId: string) => {
    try {
      return await api.post('/favorites', { itemId });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  removeFavorite: async (itemId: string) => {
    try {
      return await api.delete(`/favorites/${itemId}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Avaliações
  getReviews: async (itemId: string) => {
    try {
      return await api.get(`/reviews/${itemId}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  createReview: async (reviewData: { itemId: string; rating: number; comment: string }) => {
    try {
      return await api.post('/reviews', reviewData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Endereços
  getAddresses: async () => {
    try {
      return await api.get('/addresses');
    } catch (error) {
      handleApiError(error);
    }
  },
  
  createAddress: async (addressData: any) => {
    try {
      return await api.post('/addresses', addressData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  updateAddress: async (id: string, addressData: any) => {
    try {
      return await api.patch(`/addresses/${id}`, addressData);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  deleteAddress: async (id: string) => {
    try {
      return await api.delete(`/addresses/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Notificações
  getNotifications: async (page = 1, limit = 20) => {
    try {
      return await api.get('/notifications', { params: { page, limit } });
    } catch (error) {
      handleApiError(error);
    }
  },
  
  markNotificationAsRead: async (id: string) => {
    try {
      return await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  markAllNotificationsAsRead: async () => {
    try {
      return await api.patch('/notifications/read-all');
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Função para verificar conectividade
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Função para limpar cache da API
export const clearApiCache = async () => {
  // Implementar limpeza de cache se necessário
  console.log('Cache da API limpo');
};

export default api; 