import { useState, useEffect } from "react";
import { taskService } from "../services/task";
import type { Task } from "../types/task";
import { FaEdit, FaFilter, FaSave, FaSort, FaTimes, FaTrash } from "react-icons/fa";

type SortOption = "title" | "created_at" | "end_date";
type FilterOption = "all" | "completed" | "pending";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    description: string;
    end_date: string;
  }>({
    description: "",
    end_date: "",
  });
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];

    // Aplicar filtro
    switch (filterBy) {
      case "completed":
        filteredTasks = filteredTasks.filter((task) => task.completed);
        break;
      case "pending":
        filteredTasks = filteredTasks.filter((task) => !task.completed);
        break;
      default:
        break;
    }

    filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "created_at":
          return (
            new Date(a.created_at ?? "").getTime() -
            new Date(b.created_at ?? "").getTime()
          );
        case "end_date":
          return (
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
          );
        default:
          return 0;
      }
    });
    return filteredTasks;
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await taskService.updateTask(id, { completed });
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, completed } : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id!);
    setEditForm({
      description: task.description,
      end_date: task.end_date.split("T")[0],
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id: string) => {
    try {
      await taskService.updateTask(id, {
        description: editForm.description,
        end_date: editForm.end_date,
      });

      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                description: editForm.description,
                end_date: editForm.end_date,
              }
            : task
        )
      );

      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (tasks.length === 0) return <p>Nenhuma tarefa encontrada.</p>;

  return (
    <div>
      <div className="grid" style={{ marginBottom: "1rem" }}>
        <div>
          {/* Dropdown de Ordenação - Estilo Pico CSS */}
          <details role="list" className="dropdown">
            <summary 
              aria-haspopup="listbox" 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                cursor: "pointer"
              }}
            >
              <FaSort /> Ordenar por
            </summary>
            <ul role="listbox">
              <li>
                <button 
                  onClick={() => setSortBy("title")} 
                  className={sortBy === "title" ? "contrast" : ""}
                >
                  Título
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSortBy("created_at")}
                  className={sortBy === "created_at" ? "contrast" : ""}
                >
                  Data de Criação
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSortBy("end_date")}
                  className={sortBy === "end_date" ? "contrast" : ""}
                >
                  Data de Conclusão
                </button>
              </li>
            </ul>
          </details>
        </div>

        <div>
          {/* Dropdown de Filtro - Estilo Pico CSS */}
          <details role="list" className="dropdown">
            <summary 
              aria-haspopup="listbox" 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                cursor: "pointer"
              }}
            >
              <FaFilter /> Filtrar 
            </summary>
            <ul role="listbox">
              <li>
                <button 
                  onClick={() => setFilterBy("all")}
                  className={filterBy === "all" ? "contrast" : ""}
                >
                  Todas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilterBy("completed")}
                  className={filterBy === "completed" ? "contrast" : ""}
                >
                  Concluídas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilterBy("pending")}
                  className={filterBy === "pending" ? "contrast" : ""}
                >
                  Pendentes
                </button>
              </li>
            </ul>
          </details>
        </div>
      </div>

      <ul>
        {getFilteredAndSortedTasks().map((task) => (
          <li
            key={task.id}
            style={{ position: "relative", paddingRight: "3rem" }}
          >
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
                      style={{ width: "100%", margin: "0.5rem 0" }}
                    />
                    <input
                      type="date"
                      name="end_date"
                      value={editForm.end_date}
                      onChange={handleEditChange}
                      style={{ margin: "0.5rem 0" }}
                    />
                  </>
                ) : (
                  <>
                    <p>{task.description}</p>
                    <small>
                      Prazo: {new Date(task.end_date).toLocaleDateString()}
                      {task.completed && " - Concluída"}
                    </small>
                  </>
                )}
              </div>
            </label>

            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              {editingTask === task.id ? (
                <>
                  <button
                    onClick={() => saveEdit(task.id!)}
                    aria-label="Salvar"
                    className="icon-button"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={cancelEditing}
                    aria-label="Cancelar"
                    className="icon-button"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(task)}
                    aria-label="Editar"
                    className="icon-button"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id!)}
                    aria-label="Excluir"
                    className="icon-button"
                    style={{
                      color: "var(--form-element-invalid-border-color)",
                    }}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}