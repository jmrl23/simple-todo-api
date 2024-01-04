import { FastifyInstance } from 'fastify';
import {
  todoSchemas,
  type TodoCreateDto,
  type TodoUpdateDto,
  type TodoDeleteDto,
} from '../../dtos/todo.dto';
import { TodoService } from '../../services/todo.service';

export default async function (app: FastifyInstance) {
  const todoService = await TodoService.getInstance();

  app

    .route({
      method: 'GET',
      url: '/list',
      schema: {
        description: 'get list',
        tags: ['todo'],
      },
      async handler() {
        const todos = await todoService.getList();

        return {
          todos,
        };
      },
    })

    .route({
      method: 'POST',
      url: '/create',
      schema: {
        description: 'create todo',
        tags: ['todo'],
        body: todoSchemas.TodoCreateDto,
      },
      async handler(request) {
        const { content } = request.body as TodoCreateDto;
        const todo = await todoService.create(content);

        return {
          todo,
        };
      },
    })

    .route({
      method: 'PATCH',
      url: '/update',
      schema: {
        description: 'update todo',
        tags: ['todo'],
        body: todoSchemas.TodoUpdateDto,
      },
      async handler(request) {
        const { id, content, is_done } = request.body as TodoUpdateDto;
        const todo = await todoService.update(id, content, is_done);

        return {
          todo,
        };
      },
    })

    .route({
      method: 'DELETE',
      url: '/delete/:id',
      schema: {
        description: 'delete todo',
        tags: ['todo'],
        params: todoSchemas.TodoDeleteDto,
      },
      async handler(request) {
        const { id } = request.params as TodoDeleteDto;
        const todo = await todoService.delete(id);

        return {
          todo,
        };
      },
    });
}
