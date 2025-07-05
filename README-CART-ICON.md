# 🛒 CartIcon Component - Documentação

## 📋 Visão Geral

O `CartIcon` é um componente moderno e reutilizável que exibe o ícone do carrinho com contador de itens em diferentes contextos da aplicação.

## 🎨 Design Features

- **Badge Dinâmico**: Mostra contador de itens apenas quando há itens no carrinho
- **Múltiplos Tamanhos**: Small, Medium, Large
- **Variações de Estilo**: Header, Floating, Minimal
- **Contador Inteligente**: Mostra "99+" quando há mais de 99 itens
- **Animação de Toque**: activeOpacity para feedback visual

## 🛠️ Props Interface

```typescript
interface CartIconProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'header' | 'floating' | 'minimal';
  onPress?: () => void;
}
```

## 📱 Variações Disponíveis

### **Variant: Header** (Padrão)
- Fundo translúcido com backdrop blur
- Borda sutil branca
- Ideal para headers de telas

```typescript
<CartIcon variant="header" />
```

### **Variant: Floating**
- Fundo laranja sólido
- Sombra pronunciada
- Ideal para floating action buttons

```typescript
<CartIcon variant="floating" size="large" />
```

### **Variant: Minimal**
- Fundo discreto semi-transparente
- Sem bordas
- Ideal para contextos minimalistas

```typescript
<CartIcon variant="minimal" size="small" />
```

## 📏 Tamanhos

### **Small**
- Container: 40x40px (w-10 h-10)
- Ícone: text-base
- Badge: 20x20px

### **Medium** (Padrão)
- Container: 48x48px (w-12 h-12)
- Ícone: text-xl
- Badge: 24x24px

### **Large**
- Container: 64x64px (w-16 h-16)
- Ícone: text-2xl
- Badge: 28x28px

## 🎯 Casos de Uso

### **Header da Tela Principal**
```typescript
<CartIcon variant="header" size="medium" />
```

### **Header da Tela de Pedidos**
```typescript
<CartIcon variant="header" size="medium" />
```

### **Floating Action Button**
```typescript
<CartIcon 
  variant="floating" 
  size="large"
  onPress={() => handleCustomAction()} 
/>
```

### **Mini Carrinho em Cards**
```typescript
<CartIcon variant="minimal" size="small" />
```

## 🔧 Integração

### **Context API**
O componente se integra automaticamente com o `useCart()`:
- Obtém contador de itens em tempo real
- Atualiza automaticamente quando carrinho muda
- Não exibe badge quando carrinho está vazio

### **Navegação**
Por padrão navega para `/cart`, mas aceita `onPress` customizado:
```typescript
<CartIcon 
  onPress={() => {
    // Ação customizada
    router.push('/custom-cart');
  }} 
/>
```

## 🎨 Aparência Visual

### **Badge de Contador**
- Cor: Orange-500 (#ea580c)
- Borda: Branca semi-transparente
- Posição: Canto superior direito
- Texto: Branco, negrito, pequeno

### **Estados Visuais**
- **Sem itens**: Apenas ícone, sem badge
- **Com itens**: Ícone + badge com número
- **Mais de 99**: Badge mostra "99+"
- **Toque**: Reduz opacidade para 70%

## 🚀 Implementação nas Telas

### **Menu Principal (index.tsx)**
- Posição: Header direito
- Acompanha status do carrinho
- Exibe total de itens e preço quando há itens

### **Tela de Pedidos (two.tsx)**
- Posição: Header direito
- Permite acesso rápido ao carrinho
- Mantém consistência visual

## 📊 Performance

- **Lightweight**: Componente simples e eficiente
- **Reactive**: Atualiza automaticamente com context
- **Optimized**: Usa React.memo potencial para otimização
- **Accessible**: Feedback tátil adequado

## 🎉 Vantagens

- **Reutilizável**: Um componente para todos os casos
- **Consistente**: Design uniforme em toda a app
- **Flexível**: Múltiplas variações e tamanhos
- **Inteligente**: Integração automática com carrinho
- **Moderno**: Design atual e profissional

---

*Componente pronto para produção*
*Versão: 1.0.0* 