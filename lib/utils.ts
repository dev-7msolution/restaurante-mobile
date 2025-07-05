import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Funções utilitárias
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Aplica máscara (11) 99999-9999
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Aplica máscara (11) 9999-9999
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateOrderId = (): string => {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Formatação de erros da API
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401) {
    return 'Credenciais inválidas';
  }
  
  if (error.response?.status === 403) {
    return 'Acesso negado';
  }
  
  if (error.response?.status === 404) {
    return 'Recurso não encontrado';
  }
  
  if (error.response?.status === 422) {
    return 'Dados inválidos';
  }
  
  if (error.response?.status === 500) {
    return 'Erro interno do servidor';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Erro de conexão. Verifique sua internet';
  }
  
  return 'Erro desconhecido';
};

// Salvar preferências do usuário
export const saveUserPreferences = async (preferences: Record<string, any>) => {
  try {
    await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  }
};

// Carregar preferências do usuário
export const loadUserPreferences = async (): Promise<Record<string, any>> => {
  try {
    const preferences = await AsyncStorage.getItem('user_preferences');
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('Erro ao carregar preferências:', error);
    return {};
  }
};

// Verificar se a biometria está disponível
export const isBiometryAvailable = async (): Promise<boolean> => {
  try {
    // Aqui você pode integrar com expo-local-authentication
    // Por enquanto, vamos simular baseado na plataforma
    return Platform.OS === 'ios' || Platform.OS === 'android';
  } catch (error) {
    return false;
  }
};

// Formatar nome para exibição
export const formatDisplayName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Gerar initials para avatar
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Verificar força da senha
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string;
  color: string;
} => {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) score += 1;
  else feedback.push('Pelo menos 8 caracteres');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Letra minúscula');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Letra maiúscula');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Número');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Caractere especial');
  
  const strengthLevels = [
    { score: 0, feedback: 'Muito fraca', color: '#ef4444' },
    { score: 1, feedback: 'Fraca', color: '#f97316' },
    { score: 2, feedback: 'Fraca', color: '#f59e0b' },
    { score: 3, feedback: 'Média', color: '#eab308' },
    { score: 4, feedback: 'Forte', color: '#22c55e' },
    { score: 5, feedback: 'Muito forte', color: '#16a34a' },
  ];
  
  return strengthLevels[score] || strengthLevels[0];
};

// Limpar dados sensíveis
export const clearSensitiveData = async () => {
  try {
    const keysToRemove = [
      'restaurante_token',
      'restaurante_user',
      'restaurante_remember',
    ];
    await AsyncStorage.multiRemove(keysToRemove);
  } catch (error) {
    console.error('Erro ao limpar dados sensíveis:', error);
  }
};

// Mascarar email para exibição
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + 
    '*'.repeat(username.length - 2) + 
    username.charAt(username.length - 1);
  
  return `${maskedUsername}@${domain}`;
};

// Validar entrada de telefone
export const formatPhoneNumber = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  const match = numbers.match(/^(\d{2})(\d{5})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

// Calcular tempo decorrido
export const timeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  
  return `${Math.floor(diffInSeconds / 86400)}d`;
}; 