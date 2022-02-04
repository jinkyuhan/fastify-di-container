import { Server, IncomingMessage, ServerResponse } from 'http';
declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    container: Container;
  }
}

type ComponentRegistry = {
  [key: string]: unknown;
};

type ComponentFactory = {
  [key: string]: (...args: any[]) => object;
};
export interface ComponentSummary {
  name: string;
  constructor: (...args: any[]) => any;
}
export interface Container {
  get: <T extends unknown>(name: string) => T;
}

export interface ContainerPluginOptions {
  components: ComponentSummary[];
  containerName?: string;
  onInitialized?: <T extends unknown>(
    componentName: string,
    initializedComponent: T
  ) => Promise<void> | void;
}
