/// <reference types="node" />
import type { FastifyPluginCallback } from 'fastify/types/plugin';
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
    onInitialized?: <T extends unknown>(componentName: string, initializedComponent: T) => Promise<void> | void;
}
declare const _default: FastifyPluginCallback<ContainerPluginOptions, import("http").Server>;
export default _default;
