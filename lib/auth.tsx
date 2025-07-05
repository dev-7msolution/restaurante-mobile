import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { authApi } from './api';
import { config } from './config';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  token: string | null;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'restaurante_token';
const USER_KEY = 'restaurante_user';
const REMEMBER_KEY = 'restaurante_remember';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      const rememberMe = await AsyncStorage.getItem(REMEMBER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verificar se o token ainda é válido
        try {
          await authApi.me();
        } catch (error) {
          // Token inválido, fazer logout
          await logout();
        }
      } else if (rememberMe === 'false') {
        // Usuário não escolheu lembrar, limpar dados
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      setError('Erro ao carregar dados de autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Modo de desenvolvimento - permite login com credenciais de teste
      if (config.DEV_MODE) {
        const { TEST_CREDENTIALS } = config;
        
        if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
          // Simula delay de rede
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockToken = 'mock-jwt-token-for-testing';
          const userData = TEST_CREDENTIALS.user;

          await AsyncStorage.setItem(TOKEN_KEY, mockToken);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
          await AsyncStorage.setItem(REMEMBER_KEY, rememberMe.toString());

          setToken(mockToken);
          setUser(userData);

          router.replace('/(tabs)');
          return;
        }
      }
      
      // Login real com API
      const response = await authApi.login(email, password);
      if (!response) {
        throw new Error('Erro na comunicação com o servidor');
      }
      const { token: authToken, user: userData } = response.data;

      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(REMEMBER_KEY, rememberMe.toString());

      setToken(authToken);
      setUser(userData);

      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Credenciais inválidas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Modo de desenvolvimento - simula registro
      if (config.DEV_MODE) {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simula sucesso no registro
        router.replace('/login');
        return;
      }
      
      const response = await authApi.register({ name, email, password });
      
      if (!response) {
        throw new Error('Erro na comunicação com o servidor');
      }
      
      // Após registro, pode fazer login automático ou redirecionar para login
      // Por enquanto, vamos apenas redirecionar para login
      router.replace('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken();
      const { token: newToken } = response.data;
      
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await logout();
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, REMEMBER_KEY]);
      setToken(null);
      setUser(null);
      setError(null);
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setError('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    register,
    refreshToken,
    token,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 