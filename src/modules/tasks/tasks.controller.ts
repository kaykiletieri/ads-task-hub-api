import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('user/:userId')
  @Roles('admin', 'coordinator')
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
  createTaskForUser(
    @Param('userId') userId: string,
    @Body() taskData: CreateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.createTaskForUser(userId, req.user.sub, taskData);
  }

  @Post('class/:classId')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Create a task for a specific class',
    description: 'Creates a task for a class with the specified ID.',
  })
  @ApiParam({
    name: 'classId',
    description: 'ID of the class to create a task for',
    required: true,
    type: String,
  })
  createTaskForClass(
    @Param('classId') classId: string,
    @Body() taskData: CreateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.createTaskForClass(
      classId,
      req.user.sub,
      taskData,
    );
  }

  @Post('period/:periodId')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Create a task for a specific period',
    description: 'Creates a task for a period with the specified ID.',
  })
  @ApiParam({
    name: 'periodId',
    description: 'ID of the period to create a task for',
    required: true,
    type: String,
  })
  createTaskForPeriod(
    @Param('periodId') periodId: string,
    @Body() taskData: CreateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.createTaskForPeriod(
      periodId,
      req.user.sub,
      taskData,
    );
  }

  @Post('all-users')
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a task for all users',
    description: 'Creates a task for all users in the system.',
  })
  createTaskForAllUsers(@Body() taskData: CreateTaskDto, @Req() req: any) {
    return this.tasksService.createTaskForAllUsers(req.user.sub, taskData);
  }
}
