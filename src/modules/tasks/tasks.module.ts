import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Task } from './entities/tasks.entity';
import { Class } from '../classes/entities/classes.entity';
import { TaskAssignment } from './entities/task_assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAssignment, User, Class])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
