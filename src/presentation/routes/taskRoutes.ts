import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

export function createTaskRoutes(controller: TaskController): Router {
  const router = Router();

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);

  return router;
}
