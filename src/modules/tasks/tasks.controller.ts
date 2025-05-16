import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @Put(':id')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Updates a task with the specified ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to update',
    required: true,
    type: String,
  })
  updateTask(
    @Param('id') id: string,
    @Body() taskData: CreateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.updateTask(id, req.user.sub, taskData);
  }

  @Delete(':id')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Delete a task by ID',
    description: 'Deletes a task with the specified ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to delete',
    required: true,
    type: String,
  })
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get tasks for a specific user',
    description: 'Fetches tasks for a user with the specified ID.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to fetch tasks for',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Field to order by',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'orderDirection',
    description: 'Direction of the ordering',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of the tasks to fetch',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'availableStatus',
    description: 'Available status of the tasks to fetch',
    required: false,
    type: String,
  })
  getTasksForUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
    @Query('status') status?: string,
    @Query('availableStatus') availableStatus?: string,
  ) {
    return this.tasksService.getAllTasksByUserId(
      userId,
      {
        page,
        order_by: orderBy,
        order_direction: orderDirection,
      },
      status,
      availableStatus,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Fetches a task with the specified ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to fetch',
    required: true,
    type: String,
  })
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Get('class/:classId')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Get tasks for a specific class',
    description: 'Fetches tasks for a class with the specified ID.',
  })
  @ApiParam({
    name: 'classId',
    description: 'ID of the class to fetch tasks for',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Field to order by',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'orderDirection',
    description: 'Direction of the ordering',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of the tasks to fetch',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'availableStatus',
    description: 'Available status of the tasks to fetch',
    required: false,
    type: String,
  })
  getTasksForClass(
    @Param('classId') classId: string,
    @Query('page') page?: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
    @Query('status') status?: string,
    @Query('availableStatus') availableStatus?: string,
  ) {
    return this.tasksService.getAllTasksByClassId(
      classId,
      {
        page,
        order_by: orderBy,
        order_direction: orderDirection,
      },
      status,
      availableStatus,
    );
  }

  @Get('period/:periodId')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Get tasks for a specific period',
    description: 'Fetches tasks for a period with the specified ID.',
  })
  @ApiParam({
    name: 'periodId',
    description: 'ID of the period to fetch tasks for',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Field to order by',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'orderDirection',
    description: 'Direction of the ordering',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of the tasks to fetch',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'availableStatus',
    description: 'Available status of the tasks to fetch',
    required: false,
    type: String,
    example: 'available',
  })
  getTasksForPeriod(
    @Param('periodId') periodId: string,
    @Query('page') page?: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
    @Query('status') status?: string,
    @Query('availableStatus') availableStatus?: string,
  ) {
    return this.tasksService.getAllTasksByPeriodId(
      periodId,
      {
        page,
        order_by: orderBy,
        order_direction: orderDirection,
      },
      status,
      availableStatus,
    );
  }

  @Get('creator/:creatorId')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Get tasks created by a specific user',
    description: 'Fetches tasks created by a user with the specified ID.',
  })
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the user who created the tasks',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Field to order by',
    required: false,
    type: String,
    example: 'title',
  })
  @ApiQuery({
    name: 'orderDirection',
    description: 'Direction of the ordering',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  getTasksByCreatorId(
    @Param('creatorId') creatorId: string,
    @Query('page') page?: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
  ) {
    return this.tasksService.getAllTasksCreatedByUserId(
      creatorId,
      {
        page,
        order_by: orderBy,
        order_direction: orderDirection,
      }
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task assignment status',
    description: 'Updates the status of a task assignment with the specified ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the task assignment to update',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'status',
    description: 'New status for the task assignment',
    required: true,
    type: String,
    enum: ['pending', 'canceled', 'completed', 'expired'],
    example: 'completed',
  })
  updateTaskAssignmentStatus(
    @Param('id') id: string,
    @Query('status') status: string,
    @Req() req: any,
  ) {
    return this.tasksService.updateTaskAssignmentStatus(
      id,
      status,
      req.user.sub,
    );
  }
  
}
