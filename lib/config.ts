// Configurações da aplicação
export const config = {
  // Substitua pela URL da sua API
  API_BASE_URL: 'https://api.seurestaurante.com',
  
  // Modo de desenvolvimento (para teste sem backend)
  DEV_MODE: true,
  
  // Credenciais de teste para desenvolvimento
  TEST_CREDENTIALS: {
    email: 'teste@restaurante.com',
    password: '123456',
    user: {
      id: '1',
      name: 'Usuário Teste',
      email: 'teste@restaurante.com',
      role: 'customer',
    }
  },
  
  // Chaves do AsyncStorage
  STORAGE_KEYS: {
    TOKEN: 'restaurante_token',
    USER: 'restaurante_user',
  },
  
  // Timeouts
  API_TIMEOUT: 10000,
  
  // Validação
  MIN_PASSWORD_LENGTH: 6,
  
  // Cores do app (tema restaurante vibrante)
  COLORS: {
    PRIMARY: '#FF6B35',      // Laranja vibrante
    SECONDARY: '#FF8C42',    // Laranja coral
    ACCENT: '#FFD23F',       // Amarelo vibrante
    SUCCESS: '#06D6A0',      // Verde turquesa
    ERROR: '#EF476F',        // Rosa pink vibrante
    WARNING: '#FFA726',      // Laranja dourado
    BACKGROUND: '#FFF8E1',   // Amarelo suave
    CARD: '#FFFFFF',         // Branco puro
    TEXT_PRIMARY: '#2D3748', // Cinza escuro
    TEXT_SECONDARY: '#718096', // Cinza médio
    BORDER: '#E2E8F0',       // Cinza claro
    GRADIENT_START: '#FF6B35', // Início do gradiente
    GRADIENT_END: '#FF8C42',   // Fim do gradiente
  },
} as const; 