import type { Task } from "../types/task";
import { api } from "./auth";

export const taskService = {
  async createTask(taskData: Task) {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  async getTasks() {
    const response = await api.get("/tasks");
    return response.data;
  },

  async updateTask(id: string, taskData: Partial<Task>) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
};
