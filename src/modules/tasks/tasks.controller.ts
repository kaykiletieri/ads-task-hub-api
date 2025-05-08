import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskResponseDto } from './dtos/task-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks with pagination and filters',
    description: 'Fetch all tasks with optional filters by user ID and task status.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number, example: 10 })
  @ApiQuery({ name: 'order_by', required: false, description: 'Field to order by', type: String, example: 'created_at' })
  @ApiQuery({ name: 'order_direction', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'], example: 'DESC' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter tasks by status', enum: ['pending', 'canceled', 'completed'], example: 'pending' })
  @ApiResponse({ status: 200, description: 'Successfully fetched tasks.', type: TaskResponseDto, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllTasks(
    @Query() query: PaginationQueryDto,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ): Promise<{ data: TaskResponseDto[]; total: number }> {
    return this.tasksService.getAllTasks(query, userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID', description: 'Fetch a specific task by its ID.' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Successfully fetched the task.', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTaskById(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task', description: 'Create a new task and associate it with a user, class, and period.' })
  @ApiBody({ type: CreateTaskDto, description: 'Task data for creation.' })
  @ApiResponse({ status: 201, description: 'Successfully created the task.', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request, invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task', description: 'Update the task details by ID.' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateTaskDto, description: 'Updated task data.' })
  @ApiResponse({ status: 200, description: 'Successfully updated the task.', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task', description: 'Delete a specific task by ID.' })
  @ApiParam({ name: 'id', description: 'ID of the task', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
