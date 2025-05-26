import { useState } from "react";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function Tasks() {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login'); // Redireciona para a página de login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <article>
      <h1>Lista de Tarefas</h1>
      <p>Bem-vindo ao seu painel de controle.</p>

      <div className="grid">
        <div>
          <h2>Adicionar Nova Tarefa</h2>
          <TaskForm onTaskCreated={() => setRefresh(!refresh)} />
        </div>

        <div>
          <h2>Minhas Tarefas</h2>
          <TaskList key={refresh.toString()} />
        </div>
      </div>

      <button 
        className="secondary" 
        onClick={handleLogout}
        aria-busy={false}
      >
        Sair
      </button>
    </article>
  );
}
