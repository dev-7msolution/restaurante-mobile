import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  ...touchableProps 
}, ref) => {
  const getButtonStyle = () => {
    const baseStyle = 'items-center justify-center rounded-xl shadow-lg';
    
    const variants = {
      primary: 'bg-gradient-to-r from-orange-500 to-pink-500',
      secondary: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      outline: 'bg-white border-2 border-orange-500',
      danger: 'bg-gradient-to-r from-pink-500 to-red-500',
    };
    
    const sizes = {
      small: 'px-4 py-2',
      medium: 'px-6 py-3',
      large: 'px-8 py-4',
    };
    
    return `${baseStyle} ${variants[variant]} ${sizes[size]}`;
  };

  const getTextStyle = () => {
    const baseStyle = 'font-bold text-center';
    
    const variants = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-orange-600',
      danger: 'text-white',
    };
    
    const sizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    
    return `${baseStyle} ${variants[variant]} ${sizes[size]}`;
  };

  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`${getButtonStyle()} ${touchableProps.className || ''}`}>
      <Text className={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';
