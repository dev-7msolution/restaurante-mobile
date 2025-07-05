import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MenuCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available?: boolean;
    rating?: number;
  };
  onAddToCart?: (item: any) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <View className="bg-white/10 backdrop-blur-xl rounded-2xl mb-4 border border-white/20 overflow-hidden">
      <View className="p-6">
        <View className="flex-row items-start">
          <View className="w-20 h-20 bg-orange-500/20 rounded-2xl items-center justify-center mr-4 border border-orange-500/30">
            <Text className="text-3xl">{item.image}</Text>
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-xl font-bold text-white mb-1">
                  {item.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-orange-400 font-semibold uppercase tracking-wide mr-3">
                    {item.category}
                  </Text>
                  {item.rating && (
                    <View className="flex-row items-center">
                      <Text className="text-yellow-400 text-xs mr-1">⭐</Text>
                      <Text className="text-white/70 text-xs font-medium">
                        {item.rating}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View className="ml-4">
                <Text className="text-2xl font-bold text-orange-400">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </Text>
                {!item.available && (
                  <Text className="text-red-400 text-xs font-medium text-right">
                    Indisponível
                  </Text>
                )}
              </View>
            </View>
            
            <Text className="text-white/80 text-sm mb-4 leading-5">
              {item.description}
            </Text>
            
            <TouchableOpacity 
              onPress={() => onAddToCart?.(item)}
              disabled={!item.available}
              className="w-full rounded-xl overflow-hidden">
              <LinearGradient
                colors={
                  !item.available 
                    ? ['#666', '#666'] 
                    : ['#ea580c', '#dc2626']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-3 px-6">
                <View className="flex-row justify-center items-center">
                  <Text className="text-white font-semibold text-base">
                    {!item.available ? 'Indisponível' : 'Adicionar ao Carrinho'}
                  </Text>
                  {item.available && (
                    <Text className="text-white text-lg ml-2">+</Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {item.rating && item.rating >= 4.7 && (
        <View className="absolute top-4 left-4">
          <View className="bg-yellow-500 rounded-full px-2 py-1">
            <Text className="text-black text-xs font-bold">
              Popular
            </Text>
          </View>
        </View>
      )}
    </View>
  );
} 