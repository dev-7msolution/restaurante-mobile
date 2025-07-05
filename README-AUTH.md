# Sistema de Autenticação - Restaurante Mobile

## 🔐 Visão Geral

Este documento descreve o sistema de autenticação completo do aplicativo de restaurante, incluindo login, registro, recuperação de senha e gerenciamento de sessões.

## ✨ Funcionalidades Implementadas

### 📱 Login
- **Design moderno e elegante** com animações fluidas
- **Validação em tempo real** com feedback visual
- **Funcionalidade "Lembrar-me"** para persistência de sessão
- **Mostrar/ocultar senha** com toggle visual
- **Recuperação de senha** integrada
- **Login social** (preparado para Apple/Google)
- **Tratamento de erros** com mensagens específicas
- **Animações de feedback** para sucesso/erro

### 👤 Registro
- **Interface consistente** com o design do login
- **Validação de força da senha** em tempo real
- **Confirmação de senha** com validação
- **Aceite de termos** obrigatório
- **Verificação de email** (preparado)
- **Feedback visual** para todos os campos
- **Animações de entrada** suaves

### 🔄 Contexto de Autenticação
- **Estado global centralizado** com React Context
- **Gerenciamento automático de token** com refresh
- **Verificação de validade** do token
- **Logout seguro** com limpeza completa
- **Tratamento de erros** padronizado
- **Funcionalidade "Lembrar-me"** persistente

### 🌐 API & Networking
- **Interceptores de requisição** para token automático
- **Retry automático** para erros de rede
- **Refresh token** automático
- **Tratamento de erros** padronizado
- **Verificação de conectividade**
- **Cache management** preparado

### 🛡️ Segurança
- **Tokens JWT** com refresh automático
- **Validação de entrada** com Zod
- **Sanitização de dados** automatizada
- **Logout seguro** com limpeza de dados
- **Verificação de força da senha**
- **Prevenção de ataques** básicos

## 🏗️ Arquitetura

### Componentes Principais

```
├── app/
│   ├── login.tsx           # Tela de login
│   ├── register.tsx        # Tela de registro
│   └── _layout.tsx         # Layout com AuthProvider
├── lib/
│   ├── auth.tsx            # Contexto de autenticação
│   ├── api.ts              # Configuração da API
│   ├── schemas.ts          # Validações Zod
│   └── utils.ts            # Utilitários
└── components/
    └── ProtectedRoute.tsx  # Proteção de rotas
```

### Fluxo de Autenticação

1. **Login/Registro** → Validação → API → Token + User
2. **Armazenamento** → AsyncStorage (Token, User, Preferences)
3. **Interceptores** → Adiciona token automaticamente
4. **Refresh** → Renova token automaticamente
5. **Logout** → Limpa dados + Redireciona

## 🎨 Design System

### Cores Principais
- **Primary**: `#ea580c` (Orange-600)
- **Secondary**: `#dc2626` (Red-600)
- **Background**: Gradiente escuro elegante
- **Accent**: `#ffffff` com opacidade
- **Error**: `#ef4444` (Red-500)
- **Success**: `#22c55e` (Green-500)

### Componentes Visuais
- **Cards translúcidos** com backdrop-blur
- **Gradientes suaves** para background
- **Animações fluidas** com Animated API
- **Ícones emojis** para consistência
- **Bordas arredondadas** modernas
- **Feedback visual** instantâneo

## 📱 Experiência do Usuário

### Animações
- **Entrada suave** com fade + slide + scale
- **Feedback de sucesso** com scale animation
- **Feedback de erro** com shake animation
- **Transições fluidas** entre telas
- **Loading states** com spinners

### Validação
- **Tempo real** com debounce
- **Mensagens específicas** para cada erro
- **Indicadores visuais** (bordas coloridas)
- **Força da senha** com barra de progresso
- **Confirmação visual** para checkboxes

### Acessibilidade
- **Placeholders descritivos**
- **Labels semânticos**
- **Feedback de erro** claro
- **Navegação por teclado** otimizada
- **Contraste adequado**

## 🔧 Configuração

### Variáveis de Ambiente
```typescript
// lib/config.ts
export const config = {
  API_BASE_URL: 'https://api.seurestaurante.com',
  STORAGE_KEYS: {
    TOKEN: 'restaurante_token',
    USER: 'restaurante_user',
    REMEMBER: 'restaurante_remember',
  },
  API_TIMEOUT: 10000,
  MIN_PASSWORD_LENGTH: 6,
}
```

### Dependências
```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "axios": "^1.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "expo-linear-gradient": "^12.x",
  "expo-router": "^3.x"
}
```

## 🚀 Uso

### Hook de Autenticação
```typescript
import { useAuth } from '../lib/auth';

function MyComponent() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout, 
    register 
  } = useAuth();

  return (
    <View>
      {isAuthenticated ? (
        <Text>Bem-vindo, {user?.name}!</Text>
      ) : (
        <Button onPress={() => login(email, password)} />
      )}
    </View>
  );
}
```

### Rota Protegida
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

function PrivateScreen() {
  return (
    <ProtectedRoute>
      <MyPrivateContent />
    </ProtectedRoute>
  );
}
```

### Validação de Formulário
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../lib/schemas';

function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <TextInput {...field} />
      )}
    />
  );
}
```

## 🔍 Validações

### Esquemas Zod
```typescript
// Login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

// Registro
const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});
```

### Validação de Força da Senha
```typescript
import { checkPasswordStrength } from '../lib/utils';

const strength = checkPasswordStrength('minhasenha123');
// Retorna: { score: 3, feedback: 'Média', color: '#eab308' }
```

## 📦 Armazenamento

### AsyncStorage
- **Token**: JWT para autenticação
- **User**: Dados do usuário
- **Remember**: Preferência "lembrar-me"
- **Preferences**: Configurações do usuário

### Limpeza de Dados
```typescript
import { clearSensitiveData } from '../lib/utils';

// Limpa todos os dados sensíveis
await clearSensitiveData();
```

## 🔄 Estados de Loading

### Contexto de Auth
- **isLoading**: Carregando estado inicial
- **Operações**: Login, registro, logout
- **Verificação**: Validação de token

### Componentes UI
- **Spinners**: Para operações assíncronas
- **Skeletons**: Para carregamento de dados
- **Feedback**: Visual para todas as ações

## 🛠️ Utilitários

### Formatação
```typescript
import { formatDisplayName, maskEmail } from '../lib/utils';

const nome = formatDisplayName('joão silva'); // "João Silva"
const email = maskEmail('joao@email.com'); // "j***@email.com"
```

### Validação
```typescript
import { isValidEmail } from '../lib/utils';

const valid = isValidEmail('teste@email.com'); // true
```

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ **Tokens JWT** com expiração
- ✅ **Refresh automático** de tokens
- ✅ **Validação de entrada** rigorosa
- ✅ **Sanitização** de dados
- ✅ **HTTPS** obrigatório
- ✅ **Logout seguro**
- ✅ **Dados criptografados** no storage

### Próximos Passos
- [ ] **Biometria** (Face ID/Touch ID)
- [ ] **2FA** (Autenticação de dois fatores)
- [ ] **Social Login** (Google/Apple)
- [ ] **Verificação de email**
- [ ] **Rate limiting**
- [ ] **Captcha** para registro

## 🐛 Tratamento de Erros

### Tipos de Erro
- **Network**: Sem conexão
- **Timeout**: Requisição demorada
- **401**: Token inválido
- **422**: Dados inválidos
- **500**: Erro do servidor

### Mensagens Personalizadas
```typescript
import { formatApiError } from '../lib/utils';

try {
  await api.login(email, password);
} catch (error) {
  const message = formatApiError(error);
  Alert.alert('Erro', message);
}
```

## 🎯 Próximas Funcionalidades

### Curto Prazo
- [ ] Biometria para login rápido
- [ ] Verificação de email por código
- [ ] Social login (Apple/Google)
- [ ] Modo offline básico

### Longo Prazo
- [ ] Autenticação de dois fatores
- [ ] SSO (Single Sign-On)
- [ ] Integração com carteiras digitais
- [ ] Análise de comportamento

## 📋 Checklist de Implementação

### ✅ Concluído
- [x] Sistema de login completo
- [x] Sistema de registro
- [x] Contexto de autenticação
- [x] Validações robustas
- [x] Design moderno
- [x] Animações fluidas
- [x] Tratamento de erros
- [x] Interceptores de API
- [x] Refresh de token
- [x] Funcionalidade "lembrar-me"

### 🔄 Em Progresso
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação da API
- [ ] Monitoramento de erros

### 📅 Planejado
- [ ] Biometria
- [ ] Social login
- [ ] 2FA
- [ ] Verificação de email

## 🤝 Contribuição

Para contribuir com o sistema de autenticação:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** seguindo os padrões
4. **Teste** todas as funcionalidades
5. **Documente** as mudanças
6. **Abra** um Pull Request

## 📄 Licença

Este sistema de autenticação é parte do projeto Restaurante Mobile e segue a mesma licença do projeto principal.

---

**Desenvolvido com ❤️ para uma experiência de usuário excepcional** 