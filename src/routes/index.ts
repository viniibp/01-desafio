import { randomUUID } from "node:crypto";
import { Database } from "../db/database";
import { buildRoutePath } from "../utils/build-route-path";
import type { HttpRequest, HttpResponse } from "../@types/types";

interface IRoutes {
  method: string;
  path: RegExp;
  handler: (req: HttpRequest, res: HttpResponse) => HttpResponse | void;
}

const database = new Database();

export const routes: IRoutes[] = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search && {
          title: search,
          description: search,
        }
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const now = new Date().toISOString();

      const user = {
        id: randomUUID(),
        title,
        description,
        created_at: now,
        updated_at: now,
        completed_at: null
      };

      database.insert("tasks", user);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title or description are required" })
          );
      }

      const task = database.select("tasks", { id })[0];

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const now = new Date().toISOString();

      const task = database.select("tasks", { id })[0];

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      database.update("tasks", id, { completed_at: now });

      return res.writeHead(204).end();
    },
  },
];
