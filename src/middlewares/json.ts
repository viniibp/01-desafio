import http from "http";
import type { HttpRequest, HttpResponse } from "../@types/types";

export async function json(req: HttpRequest, res: HttpResponse) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }
  try {
    const body = JSON.parse(Buffer.concat(buffers).toString());
    req = Object.assign(req, { body });
  } catch {
    const body = null;
    req = Object.assign(req, { body });
  }

  res.setHeader("Content-type", "application/json");
}
