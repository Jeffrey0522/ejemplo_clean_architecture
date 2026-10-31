import { Task } from "../entities/Task";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
}
