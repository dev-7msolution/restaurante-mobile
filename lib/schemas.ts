import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Schema para pedido
export const orderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerEmail: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  customerPhone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  deliveryAddress: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .min(10, 'Endereço deve ser mais específico'),
  items: z
    .array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
    }))
    .min(1, 'Pelo menos um item deve ser selecionado'),
  observations: z.string().optional(),
});

// Schema para item do menu
export const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z
    .number()
    .min(0.01, 'Preço deve ser maior que zero'),
  category: z
    .enum(['entrada', 'prato-principal', 'sobremesa', 'bebida'], {
      errorMap: () => ({ message: 'Categoria inválida' }),
    }),
  available: z.boolean(),
  imageUrl: z.string().url('URL da imagem inválida').optional(),
});

// Tipos TypeScript derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>; 