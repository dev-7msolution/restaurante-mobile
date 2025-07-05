import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../lib/auth';
import { router } from 'expo-router';
import { CartIcon } from '../../components/CartIcon';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  time: string;
  status: 'Preparando' | 'A Caminho' | 'Entregue' | 'Cancelado';
  items: OrderItem[];
  total: number;
  estimatedTime?: string;
  deliveryAddress?: string;
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Dados mock de pedidos - substituir pela API real
  const mockOrders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      time: '19:30',
      status: 'Preparando',
      items: [
        { name: 'Risotto de Camarão', quantity: 1, price: 58.90 },
        { name: 'Tiramisu da Casa', quantity: 1, price: 18.90 },
      ],
      total: 77.80,
      estimatedTime: '25-35 min',
      deliveryAddress: 'Rua das Flores, 123 - Centro',
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      time: '20:15',
      status: 'Entregue',
      items: [
        { name: 'Salmão Grelhado', quantity: 1, price: 72.90 },
        { name: 'Bruschetta Especial', quantity: 2, price: 24.90 },
        { name: 'Vinho Tinto Reserva', quantity: 1, price: 89.90 },
      ],
      total: 212.60,
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-08',
      time: '18:45',
      status: 'A Caminho',
      items: [
        { name: 'Carpaccio de Carne', quantity: 1, price: 42.90 },
      ],
      total: 42.90,
      estimatedTime: '10-15 min',
    },
  ];

  const filters = ['Todos', 'Preparando', 'A Caminho', 'Entregue'];

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

    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Em desenvolvimento, usar dados mock
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      setOrders(mockOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'Todos' || order.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparando':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'A Caminho':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'Entregue':
        return 'bg-green-500/20 border-green-500/30';
      case 'Cancelado':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Preparando':
        return 'text-yellow-400';
      case 'A Caminho':
        return 'text-blue-400';
      case 'Entregue':
        return 'text-green-400';
      case 'Cancelado':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preparando':
        return '👨‍🍳';
      case 'A Caminho':
        return '🚚';
      case 'Entregue':
        return '✅';
      case 'Cancelado':
        return '❌';
      default:
        return '📋';
    }
  };

  const handleReorder = (order: Order) => {
    console.log('Refazer pedido:', order);
    // Implementar lógica de refazer pedido
  };

  const handleViewDetails = (order: Order) => {
    console.log('Ver detalhes:', order);
    // Navegar para tela de detalhes do pedido
  };

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
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-white mb-2">
                  Meus Pedidos 📦
                </Text>
                <Text className="text-white/70 text-base">
                  Acompanhe seus pedidos em tempo real
                </Text>
              </View>
              
              <View className="flex-row items-center space-x-3">
                {/* Ícone do Carrinho */}
                <CartIcon variant="header" size="medium" />
                
                {/* Contador de Pedidos */}
                <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {orders.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Filtros */}
          <View className="mb-6">
            <Text className="text-white/90 text-lg font-semibold px-6 mb-4">
              Filtrar por status
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6">
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedFilter(filter)}
                  className={`mr-3 px-6 py-3 rounded-xl ${
                    selectedFilter === filter 
                      ? 'bg-orange-500' 
                      : 'bg-white/10 border border-white/20'
                  }`}>
                  <Text className={`font-semibold ${
                    selectedFilter === filter ? 'text-white' : 'text-white/70'
                  }`}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Orders List */}
          <View className="px-6 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/90 text-lg font-semibold">
                {selectedFilter === 'Todos' ? 'Todos os Pedidos' : selectedFilter}
              </Text>
              <Text className="text-white/60 text-sm">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
              </Text>
            </View>

            {isLoading ? (
              <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 items-center border border-white/20">
                <ActivityIndicator color="#ea580c" size="large" />
                <Text className="text-white/70 text-base mt-4">
                  Carregando seus pedidos...
                </Text>
              </View>
            ) : filteredOrders.length === 0 ? (
              <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 items-center border border-white/20">
                <Text className="text-6xl mb-4">🍽️</Text>
                <Text className="text-xl font-bold text-white mb-2">
                  {selectedFilter === 'Todos' ? 'Nenhum pedido ainda' : `Nenhum pedido ${selectedFilter.toLowerCase()}`}
                </Text>
                <Text className="text-white/70 text-center mb-6">
                  {selectedFilter === 'Todos' 
                    ? 'Que tal fazer seu primeiro pedido?' 
                    : 'Tente outro filtro ou faça um novo pedido'
                  }
                </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)')}
                  className="rounded-xl overflow-hidden">
                  <LinearGradient
                    colors={['#ea580c', '#dc2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3 px-6">
                    <Text className="text-white font-semibold">
                      Ver Menu
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              filteredOrders.map((order) => (
                <View
                  key={order.id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl mb-4 border border-white/20 overflow-hidden">
                  <View className="p-6">
                    {/* Order Header */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center">
                        <View className="w-16 h-16 bg-orange-500/20 rounded-2xl items-center justify-center mr-4 border border-orange-500/30">
                          <Text className="text-2xl">{getStatusIcon(order.status)}</Text>
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-white">
                            {order.id}
                          </Text>
                          <Text className="text-sm text-white/70">
                            {order.date} às {order.time}
                          </Text>
                          {order.estimatedTime && (
                            <Text className="text-xs text-orange-400 font-medium">
                              ⏱️ {order.estimatedTime}
                            </Text>
                          )}
                        </View>
                      </View>
                      
                      <View className={`px-3 py-2 rounded-xl border ${getStatusColor(order.status)}`}>
                        <Text className={`text-sm font-semibold ${getStatusTextColor(order.status)}`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>

                    {/* Endereço de entrega */}
                    {order.deliveryAddress && (
                      <View className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
                        <Text className="text-white/70 text-xs font-medium mb-1">
                          Entrega em:
                        </Text>
                        <Text className="text-white text-sm">
                          📍 {order.deliveryAddress}
                        </Text>
                      </View>
                    )}

                    {/* Order Items */}
                    <View className="border-t border-white/10 pt-4">
                      <Text className="text-white/70 text-sm font-medium mb-3">
                        Itens do pedido:
                      </Text>
                      {order.items.map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center mb-2">
                          <View className="flex-1">
                            <Text className="text-white font-medium">
                              {item.quantity}x {item.name}
                            </Text>
                          </View>
                          <Text className="text-orange-400 font-semibold">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Order Total */}
                    <View className="border-t border-white/10 pt-4 mt-2">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-white">
                          Total
                        </Text>
                        <Text className="text-2xl font-bold text-orange-400">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mt-6 space-x-3">
                      <TouchableOpacity 
                        onPress={() => handleViewDetails(order)}
                        className="flex-1 bg-white/10 py-3 px-4 rounded-xl border border-white/20">
                        <Text className="text-white/90 font-semibold text-center">
                          Ver Detalhes
                        </Text>
                      </TouchableOpacity>
                      
                      {order.status === 'Entregue' && (
                        <TouchableOpacity 
                          onPress={() => handleReorder(order)}
                          className="flex-1 rounded-xl overflow-hidden">
                          <LinearGradient
                            colors={['#ea580c', '#dc2626']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-3 px-4">
                            <Text className="text-white font-semibold text-center">
                              Pedir Novamente
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}
