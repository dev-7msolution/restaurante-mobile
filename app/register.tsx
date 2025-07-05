import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../lib/auth';
import { registerSchema, type RegisterFormData } from '../lib/schemas';
import { checkPasswordStrength, formatDisplayName } from '../lib/utils';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const passwordStrength = password ? checkPasswordStrength(password) : null;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptTerms) {
      Alert.alert(
        'Termos de Uso',
        'Você deve aceitar os termos de uso para continuar'
      );
      return;
    }

    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      
      // Animação de sucesso
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        'Conta Criada! 🎉',
        `Bem-vindo(a), ${formatDisplayName(data.name)}! Sua conta foi criada com sucesso.`,
        [
          {
            text: 'Fazer Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      // Animação de erro
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        'Erro no Cadastro',
        error.message || 'Erro ao criar conta'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        
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
          colors={['transparent', 'rgba(0,0,0,0.3)', 'transparent']}
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
        
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <Animated.View 
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
            className="flex-1 justify-center px-6 py-8">
            
            {/* Logo e Header */}
            <View className="items-center mb-8">
              <View className="bg-white/10 backdrop-blur-xl rounded-full p-6 mb-4">
                <View className="w-12 h-12 bg-orange-500 rounded-full" />
              </View>
              
              <Text className="text-2xl font-bold text-white mb-2">
                Junte-se a nós
              </Text>
              <Text className="text-white/70 text-center text-sm">
                Crie sua conta e descubra um mundo de sabores únicos
              </Text>
            </View>

            {/* Card do Formulário */}
            <View className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20">
              
              {/* Campo Nome */}
              <View className="mb-5">
                <Text className="text-white/90 text-sm font-semibold mb-3">
                  Nome completo
                </Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full px-4 py-4 border-2 rounded-xl bg-white/5 text-white text-base ${
                        errors.name 
                          ? 'border-red-400' 
                          : 'border-white/20 focus:border-orange-400'
                      }`}
                      placeholder="João Silva"
                      placeholderTextColor="#ffffff80"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-red-400 text-sm mt-2 ml-1">
                    {errors.name.message}
                  </Text>
                )}
              </View>

              {/* Campo Email */}
              <View className="mb-5">
                <Text className="text-white/90 text-sm font-semibold mb-3">
                  Email
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full px-4 py-4 border-2 rounded-xl bg-white/5 text-white text-base ${
                        errors.email 
                          ? 'border-red-400' 
                          : 'border-white/20 focus:border-orange-400'
                      }`}
                      placeholder="seu@email.com"
                      placeholderTextColor="#ffffff80"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-red-400 text-sm mt-2 ml-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Campo Senha */}
              <View className="mb-5">
                <Text className="text-white/90 text-sm font-semibold mb-3">
                  Senha
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white/5 text-white text-base ${
                          errors.password 
                            ? 'border-red-400' 
                            : 'border-white/20 focus:border-orange-400'
                        }`}
                        placeholder="••••••••"
                        placeholderTextColor="#ffffff80"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4">
                        <Text className="text-white/60 text-sm">
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                
                {/* Indicador de força da senha */}
                {passwordStrength && password.length > 0 && (
                  <View className="mt-2">
                    <View className="flex-row items-center">
                      <View className="flex-1 h-2 bg-white/20 rounded-full mr-2">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </View>
                      <Text className="text-xs text-white/70">
                        {passwordStrength.feedback}
                      </Text>
                    </View>
                  </View>
                )}
                
                {errors.password && (
                  <Text className="text-red-400 text-sm mt-2 ml-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Campo Confirmar Senha */}
              <View className="mb-6">
                <Text className="text-white/90 text-sm font-semibold mb-3">
                  Confirmar senha
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white/5 text-white text-base ${
                          errors.confirmPassword 
                            ? 'border-red-400' 
                            : 'border-white/20 focus:border-orange-400'
                        }`}
                        placeholder="••••••••"
                        placeholderTextColor="#ffffff80"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4">
                        <Text className="text-white/60 text-sm">
                          {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-400 text-sm mt-2 ml-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* Aceitar Termos */}
              <View className="mb-6">
                <TouchableOpacity
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  className="flex-row items-start">
                  <View className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 ${
                    acceptTerms 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-white/40'
                  }`}>
                    {acceptTerms && (
                      <Text className="text-white text-xs text-center">✓</Text>
                    )}
                  </View>
                  <Text className="text-white/70 text-sm flex-1">
                    Eu aceito os{' '}
                    <Text className="text-orange-400">Termos de Uso</Text>
                    {' '}e{' '}
                    <Text className="text-orange-400">Política de Privacidade</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botão de Cadastro */}
              <TouchableOpacity
                className="w-full rounded-xl overflow-hidden mb-4"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading || !acceptTerms}>
                <LinearGradient
                  colors={
                    isLoading || !acceptTerms 
                      ? ['#666', '#666'] 
                      : ['#ea580c', '#dc2626']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 px-6">
                  <View className="flex-row justify-center items-center">
                    {isLoading ? (
                      <>
                        <ActivityIndicator color="white" size="small" />
                        <Text className="text-white text-lg font-semibold ml-2">
                          Criando conta...
                        </Text>
                      </>
                    ) : (
                      <Text className="text-white text-lg font-semibold">
                        Criar conta
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-white/20" />
                <Text className="text-white/60 text-sm mx-4">ou</Text>
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Cadastro Social (placeholder) */}
              <TouchableOpacity className="w-full bg-white/10 rounded-xl py-4 px-6 border border-white/20">
                <View className="flex-row justify-center items-center">
                  <Text className="text-white text-base font-medium">
                    Cadastrar com Apple
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Link para Login */}
            <View className="items-center mb-8">
              <Text className="text-white/70 text-center">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-orange-400 font-semibold">
                  Faça login
                </Link>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
} 