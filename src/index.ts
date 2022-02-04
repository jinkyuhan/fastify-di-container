import fp from 'fastify-plugin';
import type { FastifyPluginCallback } from 'fastify/types/plugin';
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

const containerPlugin: FastifyPluginCallback<ContainerPluginOptions> = (
  fastify,
  opts,
  done
) => {
  const onInitialized = opts?.onInitialized ?? (() => {});
  function makeContainer(components: ComponentSummary[]) {
    const registry: ComponentRegistry = {};
    const factory: ComponentFactory = {};
    components.forEach((component) => {
      factory[component.name] = component.constructor;
    });
    async function get<T extends unknown>(name: string): Promise<T> {
      // if already exists in registry, return it;
      if (registry[name] != null) {
        return registry[name] as T;
      }
      // if not exists in registry, make it recursively.
      if (factory[name] == null) {
        throw new Error(`Constructor function of [${name}] is not registered`);
      }
      registry[name] = factory[name](
        ..._extractParamNames(factory[name]).map((paramName) => get(paramName))
      );
      await onInitialized(name, registry[name]);
      return registry[name] as T;
    }
    return { get };
  }

  fastify.decorate(
    opts?.containerName || 'container',
    makeContainer(opts.components)
  );
  done();
};

function _extractParamNames(func: (...args: any[]) => any): string[] {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const ARGUMENT_NAMES = /([^\s,]+)/g;

  const str = func.toString().replace(STRIP_COMMENTS, '');
  let result = str
    .slice(str.indexOf('(') + 1, str.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result == null) result = [];
  return result;
}

export default fp(containerPlugin);
