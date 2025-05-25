import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { validateRegister } from '../utils/validation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateRegister(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '2rem' }}>
      <article>
        <hgroup>
          <h1>Criar conta</h1>
          <h2>Preencha seus dados para se registrar</h2>
        </hgroup>
        
        {error && (
          <div role="alert" className="alert" style={{ color: 'var(--form-element-invalid-border-color)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome completo</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <div style={{ position: 'relative' }}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              style={{
                position: 'absolute',
                right: '10px',
                top: '7%',
                transform: 'translateY(50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <label htmlFor="password_confirmation">Confirmar senha</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="password-toggle"
              style={{
                position: 'absolute',
                right: '10px',
                top: '7%',
                transform: 'translateY(50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="contrast"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Criar conta'}
          </button>
        </form>

        <footer>
          <Link to="/login" role="button" className="secondary outline">
            Já tem conta? Faça login
          </Link>
        </footer>
      </article>
    </div>
  );
}