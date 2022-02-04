import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
import {
  ComponentRegistry,
  ComponentSummary,
  ComponentFactory,
  ContainerPluginOptions,
} from './types';

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
    function get<T extends unknown>(name: string): T {
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
      onInitialized(name, registry[name]);
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
