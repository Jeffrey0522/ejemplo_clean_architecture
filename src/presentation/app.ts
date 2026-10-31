import express, { Express, Request, Response, NextFunction } from "express";
import { CreateTask } from "../application/use-cases/CreateTask";
import { ListTasks } from "../application/use-cases/ListTasks";
import { GetTaskById } from "../application/use-cases/GetTaskById";
import { TaskRepository } from "../domain/repositories/TaskRepository";
import { InMemoryTaskRepository } from "../infrastructure/repositories/InMemoryTaskRepository";
import { TaskController } from "./controllers/TaskController";
import { createTaskRoutes } from "./routes/taskRoutes";

// Punto de composición: aquí se crean y conectan las dependencias.
export function createApp(repository: TaskRepository = new InMemoryTaskRepository()): Express {
  const createTask = new CreateTask(repository);
  const listTasks = new ListTasks(repository);
  const getTaskById = new GetTaskById(repository);
  const controller = new TaskController(createTask, listTasks, getTaskById);

  const app = express();
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/tasks", createTaskRoutes(controller));

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Ruta no encontrada." });
  });

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: error.message || "Error interno del servidor." });
  });

  return app;
}
