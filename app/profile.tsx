import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await logout();
            setIsLoading(false);
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'Meus Pedidos',
      subtitle: 'Histórico de pedidos',
      icon: '📦',
      onPress: () => router.push('/(tabs)/two'),
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      subtitle: 'Seus pratos preferidos',
      icon: '❤️',
      onPress: () => console.log('Favoritos'),
    },
    {
      id: 'addresses',
      title: 'Endereços',
      subtitle: 'Gerenciar endereços de entrega',
      icon: '📍',
      onPress: () => console.log('Endereços'),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Configurar notificações',
      icon: '🔔',
      onPress: () => console.log('Notificações'),
    },
    {
      id: 'support',
      title: 'Suporte',
      subtitle: 'Ajuda e suporte',
      icon: '💬',
      onPress: () => console.log('Suporte'),
    },
  ];

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1">
        {/* Background elegante */}
        <LinearGradient
          colors={['#1a1a1a', '#2d1b69', '#b91c1c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        
        {/* Overlay sutil */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        <Animated.ScrollView
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          showsVerticalScrollIndicator={false}
          className="flex-1">
          
          {/* Header */}
          <View className="px-6 pt-16 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20 backdrop-blur-xl">
                <Text className="text-white font-bold text-lg">
                  ←
                </Text>
              </TouchableOpacity>
              
              <Text className="text-2xl font-bold text-white">
                Perfil
              </Text>
              
              <View className="w-12 h-12" />
            </View>
          </View>

          {/* User Info Card */}
          <View className="px-6 mb-6">
            <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <View className="flex-row items-center">
                <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mr-4">
                  <Text className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white mb-1">
                    {user?.name || 'Usuário'}
                  </Text>
                  <Text className="text-white/70 text-base mb-2">
                    {user?.email || 'email@exemplo.com'}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                      <Text className="text-green-400 text-sm font-medium">
                        Cliente VIP
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-6 mb-6">
            <Text className="text-white/90 text-lg font-semibold mb-4">
              Configurações
            </Text>
            
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-3 border border-white/20">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-orange-500/20 rounded-xl items-center justify-center mr-4 border border-orange-500/30">
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-white/60 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  <Text className="text-white/40 text-lg">
                    →
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={handleLogout}
              disabled={isLoading}
              className="rounded-xl overflow-hidden">
              <LinearGradient
                colors={isLoading ? ['#666', '#666'] : ['#dc2626', '#991b1b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 px-6">
                <Text className="text-white font-semibold text-center text-lg">
                  {isLoading ? 'Saindo...' : 'Sair da Conta'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Version info */}
          <View className="px-6 pb-6">
            <Text className="text-white/40 text-center text-sm">
              Restaurante Mobile v1.0.0
            </Text>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
} 