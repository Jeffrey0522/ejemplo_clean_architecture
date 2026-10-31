
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/presentation/app";
import { InMemoryTaskRepository } from "../../src/infrastructure/repositories/InMemoryTaskRepository";

describe("API de tareas (integración)", () => {
  let app: ReturnType<typeof createApp>;

  // Cada prueba comienza con un repositorio vacío.
  beforeEach(() => {
    app = createApp(new InMemoryTaskRepository());
  });

  it("crea una tarea y responde 201", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Preparar exposición" });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Preparar exposición");
    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBeDefined();
  });

  it("consulta la lista de tareas", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "Primera tarea" });

    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Primera tarea");
  });

  it("consulta una tarea por su identificador", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Tarea individual" });

    const response = await request(app)
      .get(`/api/tasks/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Tarea individual");
  });

  it("responde 400 cuando el título está vacío", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: " " });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("responde 404 si la tarea no existe", async () => {
    const response = await request(app)
      .get("/api/tasks/no-existe");

    expect(response.status).toBe(404);
  });
});
