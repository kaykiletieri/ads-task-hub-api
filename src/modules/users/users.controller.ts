import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users with pagination and filters',
    description: 'Fetch all users with optional filters by class ID.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number, example: 10 })
  @ApiQuery({ name: 'order_by', required: false, description: 'Field to order by', type: String, example: 'created_at' })
  @ApiQuery({ name: 'order_direction', required: false, description: 'Sort direction', enum: ['ASC', 'DESC'], example: 'DESC' })
  @ApiQuery({ name: 'classId', required: false, description: 'Filter users by class ID', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users.', type: UserResponseDto, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllUsers(
    @Query() query: PaginationQueryDto,
    @Query('classId') classId?: string,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    return this.usersService.getAllUsers(query, classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Fetch a specific user by its ID.' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Successfully fetched the user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user', description: 'Create a new user and associate it with a class.' })
  @ApiBody({ type: CreateUserDto, description: 'User data for creation.' })
  @ApiResponse({ status: 201, description: 'Successfully created the user.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request, invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user', description: 'Update the user details by ID.' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated user data.' })
  @ApiResponse({ status: 200, description: 'Successfully updated the user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user', description: 'Delete a specific user by ID.' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String, example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
