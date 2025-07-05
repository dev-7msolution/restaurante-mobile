import React, { useRef, useEffect, useState } from 'react';
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
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';

export default function CartScreen() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState('Rua das Flores, 123 - Centro');
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [couponCode, setCouponCode] = useState('');
  const [deliveryFee] = useState(8.50);
  const [serviceFee] = useState(2.50);
  const [discount] = useState(0);
  
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

  const getTotalWithFees = () => {
    return getTotalPrice() + deliveryFee + serviceFee - discount;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione alguns itens antes de finalizar o pedido.');
      return;
    }

    Alert.alert(
      'Finalizar Pedido',
      `Total Final: R$ ${getTotalWithFees().toFixed(2).replace('.', ',')} \n\nDeseja confirmar o pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Pedido',
          onPress: () => {
            clearCart();
            Alert.alert('Pedido confirmado! 🎉', 'Seu pedido foi enviado com sucesso e está sendo preparado.');
            router.push('/(tabs)/two');
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Limpar Carrinho',
      'Tem certeza que deseja remover todos os itens?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'desconto10') {
      Alert.alert('Cupom aplicado!', 'Desconto de 10% aplicado com sucesso.');
    } else if (couponCode.trim() === '') {
      Alert.alert('Cupom inválido', 'Digite um código de cupom válido.');
    } else {
      Alert.alert('Cupom inválido', 'Código não encontrado. Tente novamente.');
    }
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

        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
          
          {/* Header */}
          <View className="px-6 pt-16 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20 backdrop-blur-xl">
                <Text className="text-white font-bold text-lg">←</Text>
              </TouchableOpacity>
              
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  Carrinho
                </Text>
                {items.length > 0 && (
                  <Text className="text-white/70 text-sm">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
                  </Text>
                )}
              </View>
              
              {items.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearCart}
                  className="w-12 h-12 bg-red-500/20 rounded-full items-center justify-center border border-red-500/30">
                  <Text className="text-red-400 font-bold text-lg">🗑️</Text>
                </TouchableOpacity>
              )}
              
              {items.length === 0 && <View className="w-12 h-12" />}
            </View>
          </View>

          {items.length === 0 ? (
            // Carrinho vazio
            <View className="flex-1 justify-center items-center px-6">
              <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 items-center border border-white/20">
                <Text className="text-6xl mb-4">🛒</Text>
                <Text className="text-2xl font-bold text-white mb-2">
                  Carrinho vazio
                </Text>
                <Text className="text-white/70 text-center mb-6">
                  Adicione alguns pratos deliciosos do nosso menu!
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
            </View>
          ) : (
            // Carrinho com itens
            <View className="flex-1">
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                
                {/* Seção: Itens do Pedido */}
                <View className="px-6 mb-4">
                  <Text className="text-white font-bold text-lg mb-4">
                    📦 Itens do Pedido
                  </Text>
                  
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </View>

                {/* Seção: Cupom de Desconto */}
                <View className="px-6 mb-4">
                  <Text className="text-white font-bold text-lg mb-4">
                    🎟️ Cupom de Desconto
                  </Text>
                  
                  <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <View className="flex-row items-center">
                      <View className="flex-1 bg-white/5 rounded-xl px-4 py-3 border border-white/10 mr-3">
                        <Text className="text-white/60 text-base">
                          Digite o código do cupom...
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={handleApplyCoupon}
                        className="bg-orange-500 px-4 py-3 rounded-xl">
                        <Text className="text-white font-semibold">
                          Aplicar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text className="text-white/50 text-xs mt-2">
                      💡 Dica: Use o código "DESCONTO10" para 10% de desconto
                    </Text>
                  </View>
                </View>

                {/* Seção: Endereço de Entrega */}
                <View className="px-6 mb-4">
                  <Text className="text-white font-bold text-lg mb-4">
                    📍 Endereço de Entrega
                  </Text>
                  
                  <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-white font-semibold text-base mb-1">
                          Entregar em:
                        </Text>
                        <Text className="text-white/80 text-sm">
                          {deliveryAddress}
                        </Text>
                      </View>
                      
                      <TouchableOpacity className="bg-orange-500/20 px-3 py-2 rounded-xl border border-orange-500/30">
                        <Text className="text-orange-400 text-sm font-medium">
                          Alterar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View className="border-t border-white/10 pt-3">
                      <Text className="text-white/70 text-sm">
                        ⏱️ Tempo estimado: 25-35 minutos
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Seção: Método de Pagamento */}
                <View className="px-6 mb-4">
                  <Text className="text-white font-bold text-lg mb-4">
                    💳 Método de Pagamento
                  </Text>
                  
                  <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-500/20 rounded-xl items-center justify-center mr-3 border border-blue-500/30">
                          <Text className="text-blue-400 text-lg">💳</Text>
                        </View>
                        <Text className="text-white font-semibold text-base">
                          {paymentMethod}
                        </Text>
                      </View>
                      
                      <TouchableOpacity className="bg-orange-500/20 px-3 py-2 rounded-xl border border-orange-500/30">
                        <Text className="text-orange-400 text-sm font-medium">
                          Alterar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Seção: Resumo do Pedido */}
                <View className="px-6 mb-6">
                  <Text className="text-white font-bold text-lg mb-4">
                    📋 Resumo do Pedido
                  </Text>
                  
                  <OrderSummary
                    itemsCount={getTotalItems()}
                    subtotal={getTotalPrice()}
                    deliveryFee={deliveryFee}
                    serviceFee={serviceFee}
                    discount={discount}
                    total={getTotalWithFees()}
                  />
                </View>
              </ScrollView>
              
              {/* Bottom Section - Botão de Checkout */}
              <View className="px-6 pb-6 bg-gradient-to-t from-black/50 to-transparent">
                <TouchableOpacity
                  onPress={handleCheckout}
                  className="rounded-xl overflow-hidden">
                  <LinearGradient
                    colors={['#ea580c', '#dc2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 px-6">
                    <View className="flex-row justify-center items-center">
                      <Text className="text-white font-bold text-lg mr-2">
                        Finalizar Pedido
                      </Text>
                      <Text className="text-white font-bold text-lg">
                        • R$ {getTotalWithFees().toFixed(2).replace('.', ',')}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                
                <Text className="text-white/60 text-center text-xs mt-3">
                  Ao finalizar, você concorda com nossos termos de serviço
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </>
  );
}