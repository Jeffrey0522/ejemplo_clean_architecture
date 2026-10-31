
import { Request, Response, NextFunction } from "express";
import { CreateTask } from "../../application/use-cases/CreateTask";
import { ListTasks } from "../../application/use-cases/ListTasks";
import { GetTaskById } from "../../application/use-cases/GetTaskById";
import { Task } from "../../domain/entities/Task";

// Convertimos la entidad en un objeto sencillo para responder JSON.
function formatTask(task: Task) {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    createdAt: task.createdAt
  };
}

export class TaskController {
  constructor(
    private readonly createTask: CreateTask,
    private readonly listTasks: ListTasks,
    private readonly getTaskById: GetTaskById
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title } = req.body as { title?: string };

      if (typeof title !== "string" || !title.trim()) {
        res.status(400).json({
          message: "Envía un título de tarea válido."
        });
        return;
      }

      const task = await this.createTask.execute({ title });

      res.status(201).json(formatTask(task));
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.listTasks.execute();

      res.status(200).json(tasks.map(formatTask));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.getTaskById.execute(req.params.id);

      if (!task) {
        res.status(404).json({
          message: "No se encontró la tarea."
        });
        return;
      }

      res.status(200).json(formatTask(task));
    } catch (error) {
      next(error);
    }
  };
}
