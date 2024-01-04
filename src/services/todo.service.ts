import { randomUUID } from 'node:crypto';
import type { TodoDto } from '../dtos/todo.dto';
import { CacheService } from './cache.service';
import { caching } from 'cache-manager';
import { NotFound } from 'http-errors';

export class TodoService {
  private static instance: TodoService;
  private constructor(private readonly cacheService: CacheService) {}

  public static async createInstance(): Promise<TodoService> {
    const instance = new TodoService(
      await CacheService.createInstance(
        caching('memory', {
          ttl: 0,
        }),
      ),
    );
    return instance;
  }

  public static async getInstance(): Promise<TodoService> {
    if (!TodoService.instance) {
      TodoService.instance = await TodoService.createInstance();
    }

    return TodoService.instance;
  }

  public async getList(): Promise<TodoDto[]> {
    const cache = await this.cacheService.getCache();
    const keys = await cache.store.keys('todo:*');
    const todos = await Promise.all(
      keys.map(
        (key) => this.cacheService.get<TodoDto>(key) as Promise<TodoDto>,
      ),
    );

    return todos;
  }

  public async create(content: string): Promise<TodoDto> {
    const todo: TodoDto = {
      id: randomUUID(),
      content,
      is_done: false,
    };

    await this.cacheService.set(`todo:${todo.id}`, todo);

    return todo;
  }

  public async update(
    id: string,
    content?: string,
    is_done?: boolean,
  ): Promise<TodoDto> {
    const todo = await this.cacheService.get<TodoDto>(`todo:${id}`);

    if (!todo) throw new NotFound('Item not found');

    if (content !== undefined) todo.content = content;
    if (is_done !== undefined) todo.is_done = is_done;

    await this.cacheService.set(`todo:${id}`, todo);

    return todo;
  }

  public async delete(id: string): Promise<TodoDto> {
    const todo = await this.cacheService.get<TodoDto>(`todo:${id}`);

    if (!todo) throw new NotFound('Item not found');

    await this.cacheService.del(`todo:${id}`);

    return todo;
  }
}
