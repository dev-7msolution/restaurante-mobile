import React from 'react';
import { View, Text } from 'react-native';

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount?: number;
  total: number;
}

export function OrderSummary({ 
  itemsCount, 
  subtotal, 
  deliveryFee, 
  serviceFee, 
  discount = 0, 
  total 
}: OrderSummaryProps) {
  return (
    <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-white/80 text-base">
            Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})
          </Text>
          <Text className="text-white font-semibold text-base">
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-white/80 text-base">
            Taxa de entrega
          </Text>
          <Text className="text-white font-semibold text-base">
            R$ {deliveryFee.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-white/80 text-base">
            Taxa de serviço
          </Text>
          <Text className="text-white font-semibold text-base">
            R$ {serviceFee.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        {discount > 0 && (
          <View className="flex-row justify-between items-center">
            <Text className="text-green-400 text-base">
              Desconto
            </Text>
            <Text className="text-green-400 font-semibold text-base">
              -R$ {discount.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
        
        <View className="border-t border-white/20 pt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-xl">
              Total
            </Text>
            <Text className="text-orange-400 font-bold text-2xl">
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
} 