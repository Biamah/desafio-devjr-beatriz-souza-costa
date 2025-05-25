import type { LoginCredentials, RegisterCredentials } from "../types/auth";

/**
 * Valida os dados de registro
 * @returns Mensagem de erro ou null se válido
 */
export const validateRegister = (data: RegisterCredentials): string | null => {
  if (!data.name?.trim()) return "Nome é obrigatório";
  if (data.name.length < 3) return "Nome precisa ter pelo menos 3 caracteres";

  if (!data.email?.includes("@")) return "Email inválido";

  if (data.password.length < 6) return "Senha deve ter 6+ caracteres";
  if (data.password !== data.password_confirmation)
    return "As senhas não coincidem";

  return null; // Sem erros
};

/**
 * Valida os dados de login
 */
export const validateLogin = (data: LoginCredentials): string | null => {
  if (!data.email) return "Email é obrigatório";
  if (!data.password) return "Senha é obrigatória";
  return null;
};
