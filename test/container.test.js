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
const index_1 = __importDefault(require("../index"));
const fastify_1 = __importDefault(require("fastify"));
describe('DI container plugin test', () => {
    it('의존성 그래프에서 사이클이 없는 정상적인 경우 테스트', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastify = (0, fastify_1.default)();
        const countOfInitialize = new Map();
        const makeDependencyA = () => {
            return { name: 'dependencyA' };
        };
        countOfInitialize.set('dependencyA', 0);
        // B -> A
        const makeDependencyB = (dependencyA) => ({ name: 'dependencyB' });
        countOfInitialize.set('dependencyB', 0);
        // Component -> A, B
        const makeComponent = function (dependencyA, dependencyB) {
            return { name_: 'component' };
        };
        countOfInitialize.set('component', 0);
        yield fastify.register(index_1.default, {
            components: [
                {
                    name: 'dependencyA',
                    constructor: makeDependencyA,
                },
                {
                    name: 'dependencyB',
                    constructor: makeDependencyB,
                },
                {
                    name: 'component',
                    constructor: makeComponent,
                },
            ],
            onInitialized: (name) => {
                var _a;
                countOfInitialize.set(name, ((_a = countOfInitialize.get(name)) !== null && _a !== void 0 ? _a : 0) + 1);
            },
        });
        expect(fastify.container.get('component')).not.toBeUndefined();
        expect(fastify.container.get('component')).not.toBeNull();
        expect(countOfInitialize.get('component')).toBe(1);
        expect(countOfInitialize.get('dependencyA')).toBe(1);
        expect(countOfInitialize.get('dependencyB')).toBe(1);
    }));
});
