import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { getAuthToken, setAuthToken } from "./utils/auth";
import { Tasks } from "./pages/Tasks";

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
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}
