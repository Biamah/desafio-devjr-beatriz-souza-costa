import { useState } from 'react';
import { taskService } from '../services/task';
import type { TaskFormData } from '../types/task';

type TaskFormProps = {
  onTaskCreated: () => void;
};

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    end_date: '',
    completed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'date' ? value : value // Garante que o valor do campo de data seja tratado corretamente
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.createTask(formData);
      onTaskCreated();
      setFormData({
        title: '',
        description: '',
        end_date: '',
        completed: false
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Título</label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="description">Descrição</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <label htmlFor="end_date">Prazo</label>
      <input
        id="end_date"
        name="end_date"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
        />
        Concluída
      </label>

      <button type="submit" className="contrast">
        Adicionar Tarefa
      </button>
    </form>
  );
}