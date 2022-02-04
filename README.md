# fastify-di-container

This plugin is the small, convenient dependency container.

You can save the components you want to manage as a global singleton into the container.
To get and use those components, you only need to set the parameter name to the name of the saved component.

[![github](https://img.shields.io/github/last-commit/jinkyuhan/fastify-di-container)](https://github.com/jinkyuhan/fastify-di-container)
[![npm package](https://img.shields.io/npm/v/fastify-di-container)](https://www.npmjs.com/package/fastify-di-container)
![npm package](https://img.shields.io/bundlephobia/min/fastify-di-container)

## Installation

```bash
npm install fastify-di-container --save
```

---

## Example

with ESM syntax:

```javascript
import Fastify from 'fastify';
import container from 'fastify-di-container';

// in user.repository.ts
function makeUserRepository() {
  return {
    findOneFromDB: async (userId) => (
      // ... return from db matched with userId
    ),
  }
}

// in user.service.ts
function makeUserService(userRepository/*Parameter name matched with component name*/) {
  return {
    getUserById: async () => {
      const foundUser = await userRepository.findOneFromDB();
      return foundUser;
    },
  }
}

/* Now, UserService component has dependency to userRepository */

async function startServer() {
  const app = Fastify();
  // Just register each module as component
  await app.register(container, {
    components: [
      // Describe 'Component Summaries' in this.
      {
        name: 'userService',
        constructor: makeUserService,
      },
      {
        name: 'userRepository',
        constructor: makeUserRepository,
      }
    ]
  });

  app.listen(3000);
}

startServer();
```

---

## Additional options example

- Customize container name
- onInitializedHook

with Typescript (It works well on javascript too)

```typescript
import container from 'fastify-di-container';
import fastify from 'fastify';

const app = fastify();

app.register(container, {
  components: [
    /*... Component Summaries to register*/
  ],
  containerName: 'customContainer',
  onInitialized: <UserService>(componentName, initializedComponent) => {
    console.log(componentName);
  },
});

const userService = app.customContainer.get<UserService>('userService');

app.listen(3000);

// Only for typescript.
// If you don't use typescript, skip this.
// in type.d.ts
import { IncommingMessage, Server, ServerResponse } from 'http';
import type { Container } from 'fastify-di-container';
declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncommingMessage,
    HttpResponse = ServerResponse
  > {
    customContainer: Container;
  }
}
```
