import container from '../src/index';
import Fastify from 'fastify';
describe('DI container plugin test', () => {
  it('의존성 그래프에서 사이클이 없는 정상적인 경우 테스트', async () => {
    const fastify = Fastify();
    const countOfInitialize = new Map<string, number>();
    const makeDependencyA = () => {
      return { name: 'dependencyA' as const };
    };
    countOfInitialize.set('dependencyA', 0);
    // B -> A
    const makeDependencyB = (
      dependencyA: ReturnType<typeof makeDependencyA>
    ) => ({ name: 'dependencyB' as const });
    countOfInitialize.set('dependencyB', 0);

    // Component -> A, B
    const makeComponent = function (
      dependencyA: ReturnType<typeof makeDependencyA>,
      dependencyB: ReturnType<typeof makeDependencyB>
    ) {
      return { name_: 'component' };
    };
    countOfInitialize.set('component', 0);

    await fastify.register(container, {
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
      onInitialized: (name: string) => {
        countOfInitialize.set(name, (countOfInitialize.get(name) ?? 0) + 1);
      },
    });
    expect(fastify.container.get('component')).not.toBeUndefined();
    expect(fastify.container.get('component')).not.toBeNull();
    expect(countOfInitialize.get('component')).toBe(1);
    expect(countOfInitialize.get('dependencyA')).toBe(1);
    expect(countOfInitialize.get('dependencyB')).toBe(1);
  });
});
