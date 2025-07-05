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
  Dimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../lib/auth';
import { loginSchema, type LoginFormData } from '../lib/schemas';
import { authApi } from '../lib/api';
import { config } from '../lib/config';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
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
        'Erro no Login',
        error.response?.data?.message || 'Credenciais inválidas'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt(
      'Recuperar Senha',
      'Digite seu email para receber as instruções de recuperação:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async (email) => {
            if (email) {
              try {
                await authApi.forgotPassword(email);
                Alert.alert(
                  'Email Enviado',
                  'Verifique sua caixa de entrada para as instruções de recuperação.'
                );
              } catch (error) {
                Alert.alert(
                  'Erro',
                  'Não foi possível enviar o email de recuperação.'
                );
              }
            }
          },
        },
      ],
      'plain-text',
      '',
      'email-address'
    );
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
            className="flex-1 justify-center px-6 py-12">
            
            {/* Logo e Header */}
            <View className="items-center mb-12">
              <View className="bg-white/10 backdrop-blur-xl rounded-full p-8 mb-6">
                <View className="w-16 h-16 bg-orange-500 rounded-full" />
              </View>
              
              <Text className="text-3xl font-bold text-white mb-2">
                Bem-vindo de volta
              </Text>
              <Text className="text-white/70 text-center text-base">
                Entre na sua conta para continuar sua jornada gastronômica
              </Text>
              
              {/* Credenciais de teste - apenas em desenvolvimento */}
              {config.DEV_MODE && (
                <View className="bg-orange-500/20 rounded-xl p-4 mt-4 border border-orange-500/30">
                  <Text className="text-orange-200 text-sm font-semibold text-center mb-2">
                    🧪 Modo de Teste
                  </Text>
                  <Text className="text-white/80 text-xs text-center mb-3">
                    Email: {config.TEST_CREDENTIALS.email}{'\n'}
                    Senha: {config.TEST_CREDENTIALS.password}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setValue('email', config.TEST_CREDENTIALS.email);
                      setValue('password', config.TEST_CREDENTIALS.password);
                    }}
                    className="bg-orange-500 rounded-lg py-2 px-4">
                    <Text className="text-white text-xs font-semibold text-center">
                      Preencher automaticamente
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Card do Formulário */}
            <View className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-6 border border-white/20">
              
              {/* Campo Email */}
              <View className="mb-6">
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
              <View className="mb-6">
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
                {errors.password && (
                  <Text className="text-red-400 text-sm mt-2 ml-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Lembrar-me e Esqueceu senha */}
              <View className="flex-row justify-between items-center mb-8">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center">
                  <View className={`w-5 h-5 rounded border-2 mr-2 ${
                    rememberMe 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-white/40'
                  }`}>
                    {rememberMe && (
                      <Text className="text-white text-xs text-center">✓</Text>
                    )}
                  </View>
                  <Text className="text-white/70 text-sm">Lembrar-me</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text className="text-orange-400 text-sm font-semibold">
                    Esqueceu a senha?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botão de Login */}
              <TouchableOpacity
                className="w-full rounded-xl overflow-hidden mb-4"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}>
                <LinearGradient
                  colors={isLoading ? ['#666', '#666'] : ['#ea580c', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 px-6">
                  <View className="flex-row justify-center items-center">
                    {isLoading ? (
                      <>
                        <ActivityIndicator color="white" size="small" />
                        <Text className="text-white text-lg font-semibold ml-2">
                          Entrando...
                        </Text>
                      </>
                    ) : (
                      <Text className="text-white text-lg font-semibold">
                        Entrar
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-white/20" />
                <Text className="text-white/60 text-sm mx-4">ou</Text>
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Login Social (placeholder) */}
              <TouchableOpacity className="w-full bg-white/10 rounded-xl py-4 px-6 border border-white/20">
                <View className="flex-row justify-center items-center">
                  <Text className="text-white text-base font-medium">
                    Continuar com Apple
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Link para Registro */}
            <View className="items-center">
              <Text className="text-white/70 text-center">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-orange-400 font-semibold">
                  Cadastre-se
                </Link>
              </Text>
            </View>

            {/* Footer */}
            <View className="items-center mt-12">
              <Text className="text-white/50 text-xs text-center">
                Ao continuar, você concorda com nossos{'\n'}
                <Text className="text-orange-400">Termos de Uso</Text> e{' '}
                <Text className="text-orange-400">Política de Privacidade</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}