import { useState, useEffect } from 'react';
import { taskService } from '../services/task';
import type { Task } from '../types/task';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await taskService.updateTask(id, { completed });
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (tasks.length === 0) return <p>Nenhuma tarefa encontrada.</p>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => toggleComplete(task.id!, e.target.checked)}
            />
            <div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>
                Prazo: {new Date(task.end_date).toLocaleDateString()}
                {task.completed && ' - Concluída'}
              </small>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}