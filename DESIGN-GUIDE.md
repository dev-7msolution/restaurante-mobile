# 🎨 Guia de Design - Restaurante Mobile

## 🌈 Nova Paleta de Cores Vibrantes

### Cores Principais
```css
PRIMARY: '#FF6B35'     /* Laranja vibrante - Botões principais */
SECONDARY: '#FF8C42'   /* Laranja coral - Elementos secundários */
ACCENT: '#FFD23F'      /* Amarelo vibrante - Destaques */
SUCCESS: '#06D6A0'     /* Verde turquesa - Sucesso */
ERROR: '#EF476F'       /* Rosa pink vibrante - Erros */
WARNING: '#FFA726'     /* Laranja dourado - Avisos */
```

### Cores de Fundo
```css
BACKGROUND: '#FFF8E1'  /* Amarelo suave - Fundo principal */
CARD: '#FFFFFF'        /* Branco puro - Cards */
```

### Gradientes
```css
Login/Register: from-orange-100 to-pink-100
Botões Principais: from-orange-500 to-pink-500
Botão Sair: from-pink-500 to-red-500
Botão Secundário: from-purple-500 to-indigo-500
```

## 🎯 Aplicação das Cores

### ✅ Telas de Autenticação
- **Fundo**: Gradiente laranja para rosa claro
- **Ícones**: Gradiente laranja para rosa vibrante
- **Botões**: Gradiente laranja para rosa
- **Links**: Laranja vibrante (#FF6B35)

### ✅ Navegação (Tabs)
- **Aba Ativa**: Laranja vibrante (#FF6B35)
- **Aba Inativa**: Cinza claro (#9CA3AF)
- **Botão Sair**: Gradiente rosa para vermelho

### ✅ Tela do Menu
- **Categorias Ativas**: Gradiente laranja para rosa
- **Preços**: Laranja vibrante (#FF6B35)
- **Cards**: Fundo laranja para rosa claro
- **Botões**: Gradiente laranja para rosa

### ✅ Tela de Pedidos
- **Status "Preparando"**: Amarelo (#FFD23F)
- **Status "Entregue"**: Verde turquesa (#06D6A0)
- **Valores**: Laranja vibrante (#FF6B35)
- **Botões de Ação**: Gradiente laranja para rosa

## 🎨 Como Personalizar Ainda Mais

### 1. Alterando Cores Globais
Edite `lib/config.ts`:

```typescript
COLORS: {
  PRIMARY: '#Sua_Cor_Aqui',     // Cor principal
  SECONDARY: '#Sua_Cor_Aqui',   // Cor secundária
  // ... outras cores
}
```

### 2. Variações de Gradientes

#### Para um visual mais tropical:
```css
from-lime-400 to-green-500    /* Verde tropical */
from-yellow-400 to-orange-500 /* Pôr do sol */
from-pink-400 to-purple-500   /* Tropical noturno */
```

#### Para um visual mais elegante:
```css
from-purple-600 to-blue-600   /* Roxo elegante */
from-gray-700 to-gray-900     /* Minimalista escuro */
from-indigo-500 to-purple-600 /* Moderno */
```

### 3. Temas Alternativos

#### Tema "Oceano" 🌊
```typescript
PRIMARY: '#0EA5E9',      // Azul oceano
SECONDARY: '#06B6D4',    // Ciano
ACCENT: '#F0F9FF',       // Azul muito claro
GRADIENT: 'from-blue-400 to-cyan-500'
```

#### Tema "Floresta" 🌲
```typescript
PRIMARY: '#16A34A',      // Verde floresta
SECONDARY: '#22C55E',    // Verde claro
ACCENT: '#FACC15',       // Amarelo sol
GRADIENT: 'from-green-400 to-emerald-500'
```

#### Tema "Sunset" 🌅
```typescript
PRIMARY: '#F97316',      // Laranja pôr do sol
SECONDARY: '#FB923C',    // Laranja claro
ACCENT: '#FEF3C7',       // Amarelo suave
GRADIENT: 'from-orange-400 to-rose-400'
```

## 🚀 Aplicando Novos Temas

### Passo 1: Atualizar Configuração
```typescript
// lib/config.ts
export const config = {
  COLORS: {
    // Suas novas cores aqui
  }
}
```

### Passo 2: Atualizar Classes CSS
Substitua as classes existentes:
- `from-orange-500 to-pink-500` → `from-blue-500 to-cyan-500`
- `text-orange-600` → `text-blue-600`
- `border-orange-400` → `border-blue-400`

### Passo 3: Componentes com Cores Dinâmicas
```typescript
// Exemplo de botão com cores configuráveis
const primaryGradient = `from-${config.COLORS.PRIMARY} to-${config.COLORS.SECONDARY}`;
```

## 🎯 Dicas de UX/UI

### ✅ Contrastes Adequados
- Sempre teste legibilidade do texto
- Use ferramentas como WebAIM Contrast Checker
- Mantenha pelo menos 4.5:1 de contraste

### ✅ Consistência Visual
- Use no máximo 3-4 cores principais
- Mantenha padrões de gradientes
- Aplique a mesma paleta em todos os componentes

### ✅ Acessibilidade
- Teste com diferentes condições de visão
- Não dependa apenas de cor para informação
- Use ícones junto com cores para status

## 🔧 Ferramentas Recomendadas

### Geração de Paletas
- [Coolors.co](https://coolors.co) - Gerador de paletas
- [Adobe Color](https://color.adobe.com) - Harmonias de cores
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) - Referência

### Teste de Cores
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

---

## 💡 Inspirações de Temas para Restaurantes

### 🍕 Pizzaria Italiana
```css
Primária: #C8102E (Vermelho italiano)
Secundária: #228B22 (Verde italiano)
Gradiente: from-red-500 to-green-500
```

### 🍣 Restaurante Japonês
```css
Primária: #DC143C (Vermelho cereja)
Secundária: #000000 (Preto)
Gradiente: from-red-600 to-gray-800
```

### 🥘 Culinária Mexicana
```css
Primária: '#FF6B35' (Laranja vibrante)
Secundária: '#28A745' (Verde mexicano)  
Gradiente: from-orange-500 to-green-500
```

### 🍔 Hamburgueria Moderna
```css
Primária: '#FFC107' (Amarelo mostarda)
Secundária: '#DC3545' (Vermelho ketchup)
Gradiente: from-yellow-400 to-red-500
```

**O design atual está otimizado para um restaurante moderno e vibrante! 🎨✨** 