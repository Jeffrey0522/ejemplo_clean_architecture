import { describe, expect, it } from "vitest";
import { ListTasks } from "../../src/application/use-cases/ListTasks";
import { InMemoryTaskRepository } from "../../src/infrastructure/repositories/InMemoryTaskRepository";
import { Task } from "../../src/domain/entities/Task";

describe("ListTasks", () => {
  it("devuelve todas las tareas guardadas", async () => {
    const repository = new InMemoryTaskRepository();
    await repository.save(Task.create("Leer", "task-1"));
    await repository.save(Task.create("Practicar", "task-2"));

    const result = await new ListTasks(repository).execute();

    expect(result).toHaveLength(2);
    expect(result.map(task => task.title)).toEqual(["Leer", "Practicar"]);
  });
});
