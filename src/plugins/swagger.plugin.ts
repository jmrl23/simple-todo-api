import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPlugin from 'fastify-plugin';
import { todoSchemas } from '../dtos/todo.dto';

interface SchemaObject extends Record<string, unknown> {}

export default fastifyPlugin(async function (app) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Todo API',
        description: 'Simple Todo Restful API',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3001',
        },
      ],
      tags: [
        {
          name: 'todo',
        },
      ],
      components: {
        schemas: {
          ...(todoSchemas as Record<string, SchemaObject>),
        },
      },
    },
    hideUntagged: true,
  });

  await app.register(fastifySwaggerUi);
});
