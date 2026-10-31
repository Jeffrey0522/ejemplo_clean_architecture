import { randomUUID } from "node:crypto";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { CreateTaskDTO } from "../dtos/CreateTaskDTO";

export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(data: CreateTaskDTO): Promise<Task> {
    const task = Task.create(data.title, randomUUID());
    await this.taskRepository.save(task);
    return task;
  }
}
