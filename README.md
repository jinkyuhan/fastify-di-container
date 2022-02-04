# fastify-di-container

This plugin is the small, convenient dependency container.
You can save the components you want to manage as a global singleton into the container.
To get and use those components, you only need to set the parameter name to the name of the saved component.

## Installation

```bash
npm install fastify-di-container --save
```

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
