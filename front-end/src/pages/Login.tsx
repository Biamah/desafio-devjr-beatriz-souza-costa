import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { setAuthToken } from "../utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      // Armazena o token (ajuste conforme seu backend)
      localStorage.setItem("token", response.token);
      setAuthToken(response.token);

      // Redireciona para a página inicial após login
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "2rem" }}
    >
      <article>
        <hgroup>
          <h1>Login</h1>
          <h2>Entre com seu email e senha</h2>
        </hgroup>

        {error && (
          <div
            role="alert"
            style={{ color: "var(--form-element-invalid-border-color)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            style={{
              position: "absolute",
              right: "10px",
              top: "7%",
              transform: "translateY(50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

          <button type="submit" className="contrast" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <footer>
          <Link to="/register" role="button" className="secondary outline">
            Criar nova conta
          </Link>
        </footer>
      </article>
    </div>
  );
}
