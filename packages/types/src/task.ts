export type Task = {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string; // ISO
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
