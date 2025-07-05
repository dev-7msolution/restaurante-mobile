import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-orange-100 to-pink-100">
        <View className="bg-white rounded-2xl p-8 shadow-xl items-center">
          <View className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full items-center justify-center mb-6">
            <Text className="text-2xl">🍽️</Text>
          </View>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="mt-4 text-gray-600 font-medium">Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 