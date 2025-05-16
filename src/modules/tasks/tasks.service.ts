import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { User } from '../users/users.entity';
import { Class } from '../classes/entities/classes.entity';
import { TaskAssignment } from './entities/task_assignment.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Period } from '../periods/periods.entity';
import { TaskResponseDto } from './dtos/task-response.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  async createTaskForUser(
    userId: string,
    creatorId: string,
    taskData: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Creating task for user with ID: ${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      this.logger.error(`Creator with ID ${creatorId} not found`);
      throw new NotFoundException('Creator not found');
    }

    const task: Task = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      link: taskData.link,
      type: taskData.type,
      availability_status: taskData.availability_status,
      availability_at: taskData.availability_at,
      deadline: taskData.deadline,
      created_by: creator,
      updated_by: creator,
    });

    const createdTask = await this.taskRepository.save(task);

    const taskAssignment: TaskAssignment = this.taskAssignmentRepository.create(
      {
        status: 'pending',
        task: createdTask,
        user,
      },
    );

    await this.taskAssignmentRepository.save(taskAssignment);

    const dto: TaskResponseDto = {
      ...createdTask,
      created_by: createdTask.created_by.id,
      updated_by: createdTask.updated_by.id,
    };

    return dto;
  }

  async createTaskForClass(
    classId: string,
    creatorId: string,
    taskData: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Creating task for class with ID: ${classId}`);

    const classEntity = await this.classRepository.findOne({
      where: { id: classId, is_active: true },
    });
    if (!classEntity) {
      this.logger.warn(`Class with ID ${classId} not found`);
      throw new NotFoundException('Class not found');
    }

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      this.logger.error(`Creator with ID ${creatorId} not found`);
      throw new NotFoundException('Creator not found');
    }

    const task: Task = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      link: taskData.link,
      type: taskData.type,
      availability_status: taskData.availability_status,
      availability_at: taskData.availability_at,
      deadline: taskData.deadline,
      created_by: creator,
      updated_by: creator,
    });

    const users = await this.userRepository.find({
      where: { class: { id: classId } },
    });

    if (users.length === 0) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }

    const createdTask = await this.taskRepository.save(task);

    const taskAssignments = users.map((user) => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task: createdTask,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    const dto: TaskResponseDto = {
      ...createdTask,
      created_by: createdTask.created_by.id,
      updated_by: createdTask.updated_by.id,
    };

    return dto;
  }

  async createTaskForPeriod(
    periodId: string,
    creatorId: string,
    taskData: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Creating task for period with ID: ${periodId}`);

    const period = await this.periodRepository.findOne({
      where: { id: periodId, is_active: true },
    });
    if (!period) {
      this.logger.warn(`Period with ID ${periodId} not found`);
      throw new NotFoundException('Period not found');
    }

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      this.logger.error(`Creator with ID ${creatorId} not found`);
      throw new NotFoundException('Creator not found');
    }

    const classes: Class[] = await this.classRepository.find({
      where: { period: { id: periodId }, is_active: true },
    });

    const task: Task = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      link: taskData.link,
      type: taskData.type,
      availability_status: taskData.availability_status,
      availability_at: taskData.availability_at,
      deadline: taskData.deadline,
      created_by: creator,
      updated_by: creator,
    });

    const users = await this.userRepository.find({
      where: {
        class: { id: In(classes.map((classEntity) => classEntity.id)) },
      },
    });

    if (users.length === 0) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }

    const createdTask = await this.taskRepository.save(task);

    const taskAssignments = users.map((user) => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task: createdTask,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    const dto: TaskResponseDto = {
      ...createdTask,
      created_by: createdTask.created_by.id,
      updated_by: createdTask.updated_by.id,
    };

    return dto;
  }

  async createTaskForAllUsers(
    creatorId: string,
    taskData: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Creating task for all users`);

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      this.logger.error(`Creator with ID ${creatorId} not found`);
      throw new NotFoundException('Creator not found');
    }

    const task: Task = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      link: taskData.link,
      type: taskData.type,
      availability_status: taskData.availability_status,
      availability_at: taskData.availability_at,
      deadline: taskData.deadline,
      created_by: creator,
      updated_by: creator,
    });

    const users = await this.userRepository.find();

    if (users.length === 0) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }

    const createdTask = await this.taskRepository.save(task);

    const taskAssignments = users.map((user) => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task: createdTask,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    const dto: TaskResponseDto = {
      ...createdTask,
      created_by: createdTask.created_by.id,
      updated_by: createdTask.updated_by.id,
    };

    return dto;
  }

  async updateTask(
    taskId: string,
    userId: string,
    taskData: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Updating task with ID: ${taskId}`);

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['created_by', 'updated_by'],
    });

    if (!task) {
      this.logger.warn(`Task with ID ${taskId} not found`);
      throw new NotFoundException('Task not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    task.title = taskData.title ?? task.title;
    task.description = taskData.description ?? task.description;
    task.link = taskData.link ?? task.link;
    task.type = taskData.type ?? task.type;
    task.availability_status =
      taskData.availability_status ?? task.availability_status;
    task.availability_at = taskData.availability_at ?? task.availability_at;
    task.deadline = taskData.deadline ?? task.deadline;
    task.updated_by = user;
    task.updated_at = new Date();

    const updatedTask = await this.taskRepository.save(task);
    const dto: TaskResponseDto = {
      ...updatedTask,
      created_by: updatedTask.created_by.id,
      updated_by: updatedTask.updated_by.id,
    };
    return dto;
  }

  async deleteTask(taskId: string): Promise<void> {
    this.logger.log(`Deleting task with ID: ${taskId}`);

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      this.logger.warn(`Task with ID ${taskId} not found`);
      throw new NotFoundException('Task not found');
    }

    await this.taskAssignmentRepository.delete({ task });
    await this.taskRepository.delete(taskId);
  }

  async getTaskById(taskId: string): Promise<TaskResponseDto> {
    this.logger.log(`Getting task by ID: ${taskId}`);

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['created_by', 'updated_by'],
    });

    if (!task) {
      this.logger.warn(`Task with ID ${taskId} not found`);
      throw new NotFoundException('Task not found');
    }

    const dto: TaskResponseDto = {
      ...task,
      created_by: task.created_by.id,
      updated_by: task.updated_by.id,
    };

    return dto;
  }

  async getAllTasksByUserId(
    userId: string,
    pagination: PaginationQueryDto,
    type?: string,
    status?: string,
    availability_status?: string,
  ): Promise<TaskResponseDto[]> {
    this.logger.log(`Getting all tasks for user with ID: ${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const orderBy = pagination.order_by || 'created_at';
    const orderDir = pagination.order_direction || 'DESC';

    const qb = this.taskAssignmentRepository
      .createQueryBuilder('ta')
      .innerJoinAndSelect('ta.task', 'task')
      .innerJoinAndSelect('task.created_by', 'creator')
      .innerJoinAndSelect('task.updated_by', 'updater')
      .where('ta.user_id = :userId', { userId });

    if (type) {
      qb.andWhere('task.type = :type', { type });
    }
    if (availability_status) {
      qb.andWhere('task.availability_status = :avail', {
        avail: availability_status,
      });
    }
    if (status) {
      qb.andWhere('ta.status = :status', { status });
    }

    qb.take(limit)
      .skip((page - 1) * limit)
      .orderBy(`task.${orderBy}`, orderDir);

    const assignments = await qb.getMany();
    return assignments.map((ta) => {
      const task = ta.task;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        link: task.link,
        type: task.type,
        availability_status: task.availability_status,
        availability_at: task.availability_at,
        deadline: task.deadline,
        created_at: task.created_at,
        updated_at: task.updated_at,
        created_by: task.created_by.id,
        updated_by: task.updated_by.id,
      };
    });
  }

  async getAllTasksByClassId(
    classId: string,
    pagination: PaginationQueryDto,
    type?: string,
    status?: string,
    availability_status?: string,
  ): Promise<TaskResponseDto[]> {
    this.logger.log(`Getting all tasks for class with ID: ${classId}`);

    const classEntity = await this.classRepository.findOne({
      where: { id: classId, is_active: true },
    });
    if (!classEntity) {
      this.logger.warn(`Class with ID ${classId} not found`);
      throw new NotFoundException('Class not found');
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const orderBy = pagination.order_by || 'created_at';
    const orderDir = pagination.order_direction || 'DESC';

    const qb = this.taskAssignmentRepository
      .createQueryBuilder('ta')
      .innerJoinAndSelect('ta.task', 'task')
      .innerJoinAndSelect('task.created_by', 'creator')
      .innerJoinAndSelect('task.updated_by', 'updater')
      .innerJoinAndSelect('ta.user', 'user')
      .where('user.class_id = :classId', { classId });

    if (type) {
      qb.andWhere('task.type = :type', { type });
    }
    if (availability_status) {
      qb.andWhere('task.availability_status = :avail', {
        avail: availability_status,
      });
    }
    if (status) {
      qb.andWhere('ta.status = :status', { status });
    }

    qb.take(limit)
      .skip((page - 1) * limit)
      .orderBy(`task.${orderBy}`, orderDir);

    const assignments = await qb.getMany();
    return assignments.map((ta) => {
      const task = ta.task;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        link: task.link,
        type: task.type,
        availability_status: task.availability_status,
        availability_at: task.availability_at,
        deadline: task.deadline,
        created_at: task.created_at,
        updated_at: task.updated_at,
        created_by: task.created_by.id,
        updated_by: task.updated_by.id,
      };
    });
  }

  async getAllTasksByPeriodId(
    periodId: string,
    pagination: PaginationQueryDto,
    type?: string,
    status?: string,
    availability_status?: string,
  ): Promise<TaskResponseDto[]> {
    this.logger.log(`Getting all tasks for period with ID: ${periodId}`);

    const period = await this.periodRepository.findOne({
      where: { id: periodId, is_active: true },
    });
    if (!period) {
      this.logger.warn(`Period with ID ${periodId} not found`);
      throw new NotFoundException('Period not found');
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const orderBy = pagination.order_by || 'created_at';
    const orderDir = pagination.order_direction || 'DESC';

    const qb = this.taskAssignmentRepository
      .createQueryBuilder('ta')
      .innerJoinAndSelect('ta.task', 'task')
      .innerJoinAndSelect('task.created_by', 'creator')
      .innerJoinAndSelect('task.updated_by', 'updater')
      .innerJoinAndSelect('ta.user', 'user')
      .where('user.class_id IN (:...classIds)', {
        classIds: In(
          (await this.classRepository.find({
            where: { period: { id: periodId }, is_active: true },
          })).map((classEntity) => classEntity.id),
        ),
      });

    if (type) {
      qb.andWhere('task.type = :type', { type });
    }
    if (availability_status) {
      qb.andWhere('task.availability_status = :avail', {
        avail: availability_status,
      });
    }
    if (status) {
      qb.andWhere('ta.status = :status', { status });
    }

    qb.take(limit)
      .skip((page - 1) * limit)
      .orderBy(`task.${orderBy}`, orderDir);

    const assignments = await qb.getMany();
    return assignments.map((ta) => {
      const task = ta.task;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        link: task.link,
        type: task.type,
        availability_status: task.availability_status,
        availability_at: task.availability_at,
        deadline: task.deadline,
        created_at: task.created_at,
        updated_at: task.updated_at,
        created_by: task.created_by.id,
        updated_by: task.updated_by.id,
      };
    });
  }

  async getAllTasksCreatedByUserId(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<TaskResponseDto[]> {
    this.logger.log(`Getting all tasks created by user with ID: ${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const orderBy = pagination.order_by || 'created_at';
    const orderDir = pagination.order_direction || 'DESC';

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.created_by', 'creator')
      .innerJoinAndSelect('task.updated_by', 'updater')
      .where('task.created_by_id = :userId', { userId });

    qb.take(limit)
      .skip((page - 1) * limit)
      .orderBy(`task.${orderBy}`, orderDir);

    const tasks = await qb.getMany();
    return tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        link: task.link,
        type: task.type,
        availability_status: task.availability_status,
        availability_at: task.availability_at,
        deadline: task.deadline,
        created_at: task.created_at,
        updated_at: task.updated_at,
        created_by: task.created_by.id,
        updated_by: task.updated_by.id,
      };
    });
  }

  async updateTaskAssignmentStatus(
    taskId: string,
    userId: string,
    status: 'pending' | 'expired' | 'canceled' | 'completed',
  ): Promise<TaskAssignment> {
    this.logger.log(
      `Updating task assignment status for task ID: ${taskId}, user ID: ${userId}`,
    );

    const taskAssignment = await this.taskAssignmentRepository.findOne({
      where: { task: { id: taskId }, user: { id: userId } },
    });

    if (!taskAssignment) {
      this.logger.warn(
        `Task assignment not found for task ID ${taskId} and user ID ${userId}`,
      );
      throw new NotFoundException('Task assignment not found');
    }

    if (
      taskAssignment.status === 'canceled' ||
      taskAssignment.status === 'expired'
    ) {
      this.logger.warn(
        `Task assignment already canceled or expired for task ID ${taskId} and user ID ${userId}`,
      );
      throw new BadRequestException('Task assignment already canceled or expired');
    }

    taskAssignment.status = status;
    return this.taskAssignmentRepository.save(taskAssignment);
  }
}
