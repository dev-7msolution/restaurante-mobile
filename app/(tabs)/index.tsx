import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../lib/auth';
import { restauranteApi } from '../../lib/api';
import { MenuCard } from '../../components/MenuCard';
import { router } from 'expo-router';
import { useCart } from '../../lib/cart';
import { CartIcon } from '../../components/CartIcon';

const { width, height } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available?: boolean;
  rating?: number;
}

export default function MenuScreen() {
  const { user } = useAuth();
  const { addItem, getTotalItems, getTotalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Dados mock do menu - substituir pela API real
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Risotto de Camarão',
      description: 'Risotto cremoso com camarões frescos, açafrão e ervas finas selecionadas',
      price: 58.90,
      category: 'Pratos Principais',
      image: '🍤',
      available: true,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Salmão Grelhado',
      description: 'Salmão fresco grelhado com legumes salteados e molho de ervas aromáticas',
      price: 72.90,
      category: 'Pratos Principais',
      image: '🐟',
      available: true,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Bruschetta Especial',
      description: 'Pão artesanal italiano com tomate orgânico, manjericão e queijo burrata',
      price: 24.90,
      category: 'Entradas',
      image: '🍞',
      available: true,
      rating: 4.6,
    },
    {
      id: '4',
      name: 'Tiramisu da Casa',
      description: 'Sobremesa italiana tradicional com café expresso e mascarpone artesanal',
      price: 18.90,
      category: 'Sobremesas',
      image: '🍰',
      available: true,
      rating: 4.7,
    },
    {
      id: '5',
      name: 'Vinho Tinto Reserva',
      description: 'Vinho tinto encorpado com notas de frutas vermelhas e especiarias',
      price: 89.90,
      category: 'Bebidas',
      image: '🍷',
      available: true,
      rating: 4.5,
    },
    {
      id: '6',
      name: 'Carpaccio de Carne',
      description: 'Fatias finas de carne bovina com rúcula, parmesão e molho de mostarda',
      price: 42.90,
      category: 'Entradas',
      image: '🥩',
      available: true,
      rating: 4.4,
    },
  ];

  const categories = ['Todos', 'Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];

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

    loadMenu();
  }, []);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      // Em desenvolvimento, usar dados mock
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
      // Fallback para dados mock em caso de erro
      setMenuItems(mockMenuItems);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleAddToCart = (item: MenuItem) => {
    // Animação de feedback
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
    });

    // Feedback visual para o usuário
    console.log('Adicionado ao carrinho:', item.name);
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
          
          {/* Header Welcome */}
          <View className="px-6 pt-16 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-white mb-2">
                  Olá, {user?.name?.split(' ')[0] || 'Chef'}! 👋
                </Text>
                <Text className="text-white/70 text-base">
                  Que tal experimentar algo delicioso hoje?
                </Text>
              </View>
              
              <View className="flex-row items-center space-x-3">
                {/* Ícone do Carrinho */}
                <CartIcon variant="header" />
                
                {/* Ícone de Configurações */}
                <TouchableOpacity
                  onPress={() => router.push('/profile')}
                  className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20 backdrop-blur-xl">
                  <Text className="text-white font-bold text-lg">
                    ⚙️
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Status do Carrinho (quando há itens) */}
            {getTotalItems() > 0 && (
              <View className="bg-orange-500/20 rounded-xl p-3 border border-orange-500/30 mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-orange-400 text-base font-semibold mr-2">
                      🛒 {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} no carrinho
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push('/cart')}
                    className="bg-orange-500 px-4 py-2 rounded-xl">
                    <Text className="text-white font-semibold text-sm">
                      Ver Carrinho
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-orange-300 text-sm mt-1">
                  Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                </Text>
              </View>
            )}
          </View>

          {/* Search Bar */}
          <View className="px-6 mb-6">
            <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <Text className="text-white/90 text-sm font-semibold mb-3">
                Buscar pratos
              </Text>
              <View className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                {/* Placeholder para input de busca */}
                <Text className="text-white/60 text-base">
                  {searchQuery || 'Digite o nome do prato...'}
                </Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View className="mb-6">
            <Text className="text-white/90 text-lg font-semibold px-6 mb-4">
              Categorias
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(category)}
                  className={`mr-3 px-6 py-3 rounded-xl ${
                    selectedCategory === category 
                      ? 'bg-orange-500' 
                      : 'bg-white/10 border border-white/20'
                  }`}>
                  <Text className={`font-semibold ${
                    selectedCategory === category ? 'text-white' : 'text-white/70'
                  }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Menu Items */}
          <View className="px-6 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/90 text-lg font-semibold">
                {selectedCategory === 'Todos' ? 'Todos os Pratos' : selectedCategory}
              </Text>
              <Text className="text-white/60 text-sm">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>

            {isLoading ? (
              <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 items-center border border-white/20">
                <ActivityIndicator color="#ea580c" size="large" />
                <Text className="text-white/70 text-base mt-4">
                  Carregando menu delicioso...
                </Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 items-center border border-white/20">
                <Text className="text-6xl mb-4">🍽️</Text>
                <Text className="text-xl font-bold text-white mb-2">
                  Nenhum prato encontrado
                </Text>
                <Text className="text-white/70 text-center">
                  Tente buscar por outro termo ou categoria
                </Text>
              </View>
            ) : (
              filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </View>


        </Animated.ScrollView>
      </View>
    </>
  );
}
