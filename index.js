"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const containerPlugin = (fastify, opts, done) => {
    var _a;
    const onInitialized = (_a = opts === null || opts === void 0 ? void 0 : opts.onInitialized) !== null && _a !== void 0 ? _a : (() => { });
    function makeContainer(components) {
        const registry = {};
        const factory = {};
        components.forEach((component) => {
            factory[component.name] = component.constructor;
        });
        function get(name) {
            return __awaiter(this, void 0, void 0, function* () {
                // if already exists in registry, return it;
                if (registry[name] != null) {
                    return registry[name];
                }
                // if not exists in registry, make it recursively.
                if (factory[name] == null) {
                    throw new Error(`Constructor function of [${name}] is not registered`);
                }
                registry[name] = factory[name](..._extractParamNames(factory[name]).map((paramName) => get(paramName)));
                yield onInitialized(name, registry[name]);
                return registry[name];
            });
        }
        return { get };
    }
    fastify.decorate((opts === null || opts === void 0 ? void 0 : opts.containerName) || 'container', makeContainer(opts.components));
    done();
};
function _extractParamNames(func) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const str = func.toString().replace(STRIP_COMMENTS, '');
    let result = str
        .slice(str.indexOf('(') + 1, str.indexOf(')'))
        .match(ARGUMENT_NAMES);
    if (result == null)
        result = [];
    return result;
}
exports.default = (0, fastify_plugin_1.default)(containerPlugin);
