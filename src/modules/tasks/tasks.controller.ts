import {
  Controller,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiTags
} from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
}
