import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    description: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <View className="bg-white/10 backdrop-blur-xl rounded-2xl mb-3 border border-white/20 p-4">
      <View className="flex-row items-start">
        <View className="w-20 h-20 bg-orange-500/20 rounded-xl items-center justify-center mr-4 border border-orange-500/30">
          <Text className="text-3xl">{item.image}</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-white font-bold text-lg mb-1">
            {item.name}
          </Text>
          <Text className="text-white/60 text-sm mb-2">
            {item.category}
          </Text>
          <Text className="text-white/80 text-xs mb-3 leading-4">
            {item.description}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-orange-400 font-semibold text-lg">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </Text>
            
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-white/10 rounded-full items-center justify-center border border-white/20">
                <Text className="text-white font-bold">-</Text>
              </TouchableOpacity>
              
              <Text className="text-white font-bold text-lg mx-4">
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
                <Text className="text-white font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-white/70 text-sm">
              Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
            </Text>
            
            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              className="bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              <Text className="text-red-400 text-xs font-medium">
                Remover
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 