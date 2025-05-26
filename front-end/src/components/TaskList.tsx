import { useState, useEffect } from 'react';
import { taskService } from '../services/task';
import type { Task } from '../types/task';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{description: string; end_date: string}>({
    description: '',
    end_date: ''
  });

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

  const startEditing = (task: Task) => {
    setEditingTask(task.id!);
    setEditForm({
      description: task.description,
      end_date: task.end_date.split('T')[0] // Formato YYYY-MM-DD
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id: string) => {
    try {
      await taskService.updateTask(id, {
        description: editForm.description,
        end_date: editForm.end_date
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? { 
          ...task, 
          description: editForm.description,
          end_date: editForm.end_date
        } : task
      ));
      
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (tasks.length === 0) return <p>Nenhuma tarefa encontrada.</p>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} style={{ position: 'relative' }}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => toggleComplete(task.id!, e.target.checked)}
            />
            <div>
              <strong>{task.title}</strong>
              
              {editingTask === task.id ? (
                <>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={3}
                    style={{ width: '100%', margin: '0.5rem 0' }}
                  />
                  <input
                    type="date"
                    name="end_date"
                    value={editForm.end_date}
                    onChange={handleEditChange}
                    style={{ margin: '0.5rem 0' }}
                  />
                </>
              ) : (
                <>
                  <p>{task.description}</p>
                  <small>
                    Prazo: {new Date(task.end_date).toLocaleDateString()}
                    {task.completed && ' - Concluída'}
                  </small>
                </>
              )}
            </div>
          </label>

          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            {editingTask === task.id ? (
              <>
                <button 
                  onClick={() => saveEdit(task.id!)}
                  style={{ marginRight: '0.5rem' }}
                  aria-label="Salvar"
                >
                  <FaSave />
                </button>
                <button 
                  onClick={cancelEditing}
                  aria-label="Cancelar"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <button 
                onClick={() => startEditing(task)}
                aria-label="Editar"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}