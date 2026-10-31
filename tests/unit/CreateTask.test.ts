import { describe, expect, it } from "vitest";
import { CreateTask } from "../../src/application/use-cases/CreateTask";
import { TaskRepository } from "../../src/domain/repositories/TaskRepository";
import { Task } from "../../src/domain/entities/Task";

class FakeTaskRepository implements TaskRepository {
  public saved: Task[] = [];
  async save(task: Task): Promise<void> { this.saved.push(task); }
  async findAll(): Promise<Task[]> { return this.saved; }
  async findById(id: string): Promise<Task | null> {
    return this.saved.find(task => task.id === id) ?? null;
  }
}

describe("CreateTask", () => {
  it("crea y guarda una tarea", async () => {
    const repository = new FakeTaskRepository();
    const useCase = new CreateTask(repository);

    const result = await useCase.execute({ title: "Estudiar TypeScript" });

    expect(result.title).toBe("Estudiar TypeScript");
    expect(result.completed).toBe(false);
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0].id).toBe(result.id);
  });

  it("rechaza un título vacío", async () => {
    const useCase = new CreateTask(new FakeTaskRepository());

    await expect(useCase.execute({ title: "   " }))
      .rejects.toThrow("El título de la tarea es obligatorio.");
  });
});
