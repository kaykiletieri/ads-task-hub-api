import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { User } from '../users/users.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { TaskResponseDto } from './dtos/task-response.dto';
import { Class } from '../classes/entities/classes.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getAllTasks(
    queryDto: PaginationQueryDto,
    userId?: string,
    status?: string,
  ): Promise<{ data: TaskResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;

    this.logger.debug(
      `Fetching tasks - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const whereCondition: any = {};

    if (userId) {
      whereCondition.user = { id: userId };
    }

    if (status) {
      whereCondition.status = status;
    }

    const [data, total] = await this.taskRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: (page - 1) * limit,
      order: { [order_by]: order_direction },
      relations: ['user', 'class', 'period'],
    });

    this.logger.debug(`Found ${total} tasks`);

    return {
      data: data.map((taskEntity) => this.mapToResponseDto(taskEntity)),
      total,
    };
  }

  async getTaskById(id: string): Promise<TaskResponseDto> {
    this.logger.debug(`Fetching task with ID: ${id}`);

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'class', 'period'],
    });

    if (!task) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new BadRequestException('Task not found');
    }

    this.logger.debug(`Found task with ID: ${id}`);

    return this.mapToResponseDto(task);
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResponseDto> {
    this.logger.debug(
      `Creating task with title: ${dto.title}, user_id: ${dto.user_id}, class_id: ${dto.class_id}`,
    );

    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    const classEntity = await this.classRepository.findOne({
      where: { id: dto.class_id },
    });

    if (!user) {
      this.logger.warn(`User with ID: ${dto.user_id} not found`);
      throw new BadRequestException('User not found');
    }

    if (!classEntity) {
      this.logger.warn(`Class with ID: ${dto.class_id} not found`);
      throw new BadRequestException('Class not found');
    }

    const taskEntity = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      deadline: dto.deadline,
      status: dto.status,
      link: dto.link,
      user,
      class: classEntity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await this.taskRepository.save(taskEntity);

    this.logger.debug(`Task created with ID: ${taskEntity.id}`);

    return this.mapToResponseDto(taskEntity);
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    this.logger.debug(`Updating task with ID: ${id}`);

    const taskEntity = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'class', 'period'],
    });

    if (!taskEntity) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new BadRequestException('Task not found');
    }

    if (dto.user_id) {
      const user = await this.userRepository.findOne({
        where: { id: dto.user_id },
      });
      if (!user) {
        this.logger.warn(`User with ID: ${dto.user_id} not found`);
        throw new BadRequestException('User not found');
      }
      taskEntity.user = user;
    }

    if (dto.class_id) {
      const classEntity = await this.classRepository.findOne({
        where: { id: dto.class_id },
      });
      if (!classEntity) {
        this.logger.warn(`Class with ID: ${dto.class_id} not found`);
        throw new BadRequestException('Class not found');
      }
      taskEntity.class = classEntity;
    }

    taskEntity.title = dto.title || taskEntity.title;
    taskEntity.description = dto.description || taskEntity.description;
    taskEntity.type = dto.type || taskEntity.type;
    taskEntity.deadline = dto.deadline || taskEntity.deadline;
    taskEntity.status = dto.status || taskEntity.status;
    taskEntity.link = dto.link || taskEntity.link;
    taskEntity.updated_at = new Date().toISOString();

    await this.taskRepository.save(taskEntity);

    this.logger.debug(`Task updated with ID: ${taskEntity.id}`);

    return this.mapToResponseDto(taskEntity);
  }

  async deleteTask(id: string): Promise<void> {
    this.logger.debug(`Deleting task with ID: ${id}`);

    const taskEntity = await this.taskRepository.findOne({ where: { id } });

    if (!taskEntity) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new BadRequestException('Task not found');
    }

    await this.taskRepository.remove(taskEntity);

    this.logger.debug(`Task with ID: ${id} deleted`);
  }

  private mapToResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.type,
      deadline: task.deadline,
      status: task.status,
      link: task.link,
      created_at: task.created_at,
      updated_at: task.updated_at,
      user_id: task.user.id,
      class_id: task.class.id,
    };
  }
}
