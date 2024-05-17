import http from "http";
import { json } from "./middlewares/json.ts";
import { routes } from "./routes/index.ts";
import { extractQueryParams } from "./utils/extract-query-params.ts";
import type { RouteParams } from "./@types/types.ts";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url as string)
  );  

  if (route) {
    const routeParams = req.url?.match(route.path);

    const { query, ...params } = routeParams?.groups as RouteParams;

    Object.assign(req, { params, query: extractQueryParams(query) });

    return route.handler(req, res);
  }
  return res.writeHead(404).end();
});

server.listen(3333);
