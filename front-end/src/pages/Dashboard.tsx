import { useState } from "react";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";

export function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  return (
    <article>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao seu painel de controle</p>

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

      <button className="secondary">Sair</button>
    </article>
  );
}
