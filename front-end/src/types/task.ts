export interface Task {
  id?: string;
  title: string;
  description: string;
  end_date: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export type TaskFormData = Omit<Task, "id" | "created_at" | "updated_at">;
