import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { User } from '../users/users.entity';
import { Class } from '../classes/entities/classes.entity';
import { TaskAssignment } from './entities/task_assignment.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Period } from '../periods/periods.entity';

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
  ) { }

  async createTaskForUser(
    userId: string,
    creatorId: string,
    taskData: CreateTaskDto) : Promise<Task> {
    this.logger.log(`Creating task for user with ID: ${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
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

    const taskAssignment: TaskAssignment = this.taskAssignmentRepository.create({
      status: 'pending',
      task,
      user,
    });

    await this.taskAssignmentRepository.save(taskAssignment);

    return this.taskRepository.save(task);
  }

  async createTaskForClass(
    classId: string,
    creatorId: string,
    taskData: CreateTaskDto) : Promise<Task> {
    this.logger.log(`Creating task for class with ID: ${classId}`);

    const classEntity = await this.classRepository.findOne({ where: { id: classId, is_active: true } });
    if (!classEntity) {
      this.logger.warn(`Class with ID ${classId} not found`);
      throw new NotFoundException('Class not found');
    }

    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
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

    const users = await this.userRepository.find({ where: { class: { id: classId } } });

    if (users.length === 0) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }

    const taskAssignments = users.map(user => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    return this.taskRepository.save(task);
  }

  async createTaskForPeriod(
    periodId: string,
    creatorId: string,
    taskData: CreateTaskDto) : Promise<Task> {
    this.logger.log(`Creating task for period with ID: ${periodId}`);

    const period = await this.periodRepository.findOne({ where: { id: periodId, is_active: true } });
    if (!period) {
      this.logger.warn(`Period with ID ${periodId} not found`);
      throw new NotFoundException('Period not found');
    }

    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      this.logger.error(`Creator with ID ${creatorId} not found`);
      throw new NotFoundException('Creator not found');
    }

    const classes: Class[] = await this.classRepository.find({ where: { period: { id: periodId }, is_active: true } });

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
        class: { id: In(classes.map(classEntity => classEntity.id)) },
      },
    });

    if (users.length === 0) {
      this.logger.warn(`No users found`);
      throw new NotFoundException('No users found');
    }

    const taskAssignments = users.map(user => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    return this.taskRepository.save(task);
  }

  async createTaskForAllUsers(
    creatorId: string,
    taskData: CreateTaskDto) : Promise<Task> {
    this.logger.log(`Creating task for all users`);

    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
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

    const taskAssignments = users.map(user => {
      return this.taskAssignmentRepository.create({
        status: 'pending',
        task,
        user,
      });
    });

    await this.taskAssignmentRepository.save(taskAssignments);

    return this.taskRepository.save(task);
  }
}
