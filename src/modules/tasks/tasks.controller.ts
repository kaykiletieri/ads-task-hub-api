import {
  Body,
  Controller,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('user/:userId')
  @ApiOperation({
    summary: 'Create a task for a specific user',
    description: 'Creates a task for a user with the specified ID.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to create a task for',
    required: true,
    type: String,
  })
  createTaskForUser(@Param('userId') userId: string, @Body() taskData: CreateTaskDto, @Req() req: any) {
    return this.tasksService.createTaskForUser(userId, req.user.sub, taskData);
  }
  
}
