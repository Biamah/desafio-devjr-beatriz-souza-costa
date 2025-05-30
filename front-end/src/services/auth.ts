import axios from "axios";
import { setAuthToken } from "../utils/auth";
import type {
  ApiError,
  AuthResponse,
  RegisterCredentials,
  User,
} from "../types/auth";

// Configuração base do Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  withXSRFToken: true,
});

// Interceptor para adicionar o token às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
      const { access_token, user } = response.data;
      setAuthToken(access_token);

      return { access_token, user };
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
  async logout(): Promise<void> {
    try {
      await api.post("/logout");
      this.clearAuth(); // Limpa os dados locais
    } catch (error) {
      console.error("Logout error:", error);
      this.clearAuth(); // Limpa os dados mesmo se a requisição falhar
    }
  },

  clearAuth(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
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
      const { access_token, user } = response.data;
      setAuthToken(access_token);
      return { access_token, user };
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
