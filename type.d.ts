import { IncomingMessage, Server, ServerResponse } from 'http';
import { Container } from './types';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    container?: Container;
  }
}
