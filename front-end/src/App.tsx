import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { getAuthToken, setAuthToken } from './utils/auth';

export function App() {

  // Inicialização: Configura o token se existir ao carregar o app
  const token = getAuthToken();
  console.log({ token });
  if (token) {
    setAuthToken(token);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}  