import http from "http";

interface IDefaultParams {
  body?: any | null;
  params?: any | null;
  query?: any | null;
}

export type HttpRequest = http.IncomingMessage & IDefaultParams;
export type HttpResponse = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

export type RouteParams = {
  query?: string;
  params?:
    | {
        [key: string]: string;
      }
    | undefined;
};
