import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Task } from './tasks.entity';
import { Class } from '../classes/entities/classes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Class])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
