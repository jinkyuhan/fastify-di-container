import { Server, IncomingMessage, ServerResponse } from 'http';
declare module 'fastify' {
  interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    container: Container;
  }
}
