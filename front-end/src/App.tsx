import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}  