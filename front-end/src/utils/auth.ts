import type { User } from "../types/auth";
import { api } from "../services/auth";

/**
 * Armazena o token JWT e configura os headers do Axios
 * @param token - Token JWT ou null para logout
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    console.log({ token });
    // Armazena no localStorage
    localStorage.setItem("token", token);

    // Configura o header Authorization em todas as requisições
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove o token e o header
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    // Limpa também o usuário do cache
    localStorage.removeItem("currentUser");
  }
};

/**
 * Recupera o token JWT armazenado
 * @returns Token JWT ou null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Verifica se existe um token válido
 * @returns boolean
 */
export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};

/**
 * Armazena os dados do usuário no localStorage
 * @param user - Objeto usuário
 */
export const setCurrentUser = (user: User): void => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

/**
 * Recupera os dados do usuário armazenados
 * @returns User ou null
 */
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

/**
 * Remove todos os dados de autenticação
 */
export const clearAuth = (): void => {
  setAuthToken(null);
  localStorage.removeItem("currentUser");
};
