import axios, { AxiosError } from "axios";
import { setAuthToken } from "../utils/auth";
import type {
  ApiError,
  AuthResponse,
  RegisterCredentials,
  User,
} from "../types/auth";

// Configuração base do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  withXSRFToken: true,
});

// Interceptor para adicionar o token às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Realiza o login do usuário
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", {
        email,
        password,
      });

      // Armazena o token recebido do backend
      const { token, user } = response.data;
      setAuthToken(token);

      return { token, user };
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError<ApiError>(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Falha no login. Verifique suas credenciais e tente novamente."
        );
      }
      throw new Error(
        "Falha no login. Verifique suas credenciais e tente novamente."
      );
    }
  },

  /**
   * Realiza o logout
   */
  logout(): void {
    setAuthToken(null);
  },

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await api.get<User>("/me");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  },

  /**
   * Registra um novo usuário
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/register", credentials);
      const { token, user } = response.data;
      setAuthToken(token);
      return { token, user };
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError<ApiError>(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Falha no registro. Verifique seus dados e tente novamente."
        );
      }
      throw new Error("Falha no registro. Tente novamente mais tarde.");
    }
  },
};
