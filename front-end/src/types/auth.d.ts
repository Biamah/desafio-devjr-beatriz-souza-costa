/**
 * src/types/auth.ts
 * Tipos relacionados à autenticação e usuários
 */

/**
 * Representa um usuário do sistema
 */
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Resposta da API após login bem-sucedido
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Credenciais para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Estrutura de erro padrão da API
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * @deprecated - Use User interface instead
 * (Mantido para compatibilidade temporária)
 */
export type UserProfile = Pick<User, "id" | "name" | "email">;
