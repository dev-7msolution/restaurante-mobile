import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '../lib/cart';

interface CartIconProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'header' | 'floating' | 'minimal';
  onPress?: () => void;
}

export function CartIcon({ 
  size = 'medium', 
  variant = 'header',
  onPress 
}: CartIconProps) {
  const { getTotalItems } = useCart();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/cart');
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-10 h-10';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'text-base';
      case 'large':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  const getBadgeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-5 h-5 -top-1 -right-1';
      case 'large':
        return 'w-7 h-7 -top-2 -right-2';
      default:
        return 'w-6 h-6 -top-2 -right-2';
    }
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'floating':
        return 'bg-orange-500 shadow-2xl';
      case 'minimal':
        return 'bg-white/5';
      default:
        return 'bg-white/10 border border-white/20 backdrop-blur-xl';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="relative"
      activeOpacity={0.7}>
      <View className={`${getSizeClasses()} ${getContainerClasses()} rounded-full items-center justify-center`}>
        <Text className={`${getIconSize()} ${variant === 'floating' ? 'text-white' : 'text-white'}`}>
          🛒
        </Text>
      </View>
      
      {getTotalItems() > 0 && (
        <View className={`absolute ${getBadgeClasses()} bg-orange-500 rounded-full items-center justify-center border-2 border-white/20`}>
          <Text className="text-white text-xs font-bold">
            {getTotalItems() > 99 ? '99+' : getTotalItems()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 