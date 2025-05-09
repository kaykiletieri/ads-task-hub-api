import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ClassesService } from './services/classes.service';
import { ClassResponseDto } from './dtos/class-response.dto';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ClassTokenService } from './services/class-token.service';
import { ClassToken } from './entities/class-token.entity';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('classes')
@ApiTags('Classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly classTokenService: ClassTokenService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all classes with pagination',
    description: 'Fetch all classes with pagination support.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    description: 'Field to order by',
    type: String,
    example: 'created_at',
  })
  @ApiQuery({
    name: 'order_direction',
    required: false,
    description: 'Direction of the ordering',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched classes.',
    type: ClassResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAllClasses(
    @Query() query: PaginationQueryDto,
  ): Promise<{ data: ClassResponseDto[]; total: number }> {
    return this.classesService.getAllClasses(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get class by ID',
    description: 'Fetch a specific class by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the class',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the class.',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getClassById(@Param('id') id: string): Promise<ClassResponseDto> {
    return this.classesService.getClassById(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new class',
    description: 'Create a new class with the provided data.',
  })
  @ApiBody({
    type: CreateClassDto,
    description: 'Class data to create a new class.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the class.',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async createClass(
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.createClass(createClassDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update an existing class',
    description: 'Update the class details by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the class',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateClassDto,
    description: 'Class data to update the existing class.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the class.',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete a class',
    description: 'Delete a specific class by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the class to be deleted',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the class.',
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async deleteClass(@Param('id') id: string): Promise<void> {
    return this.classesService.deleteClass(id);
  }

  @Get('period/:periodId')
  @ApiOperation({
    summary: 'Get classes by period',
    description: 'Fetch all classes for a specific period.',
  })
  @ApiParam({
    name: 'periodId',
    description: 'ID of the period',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched classes for the given period.',
    type: ClassResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'No classes found for the given period.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getClassesByPeriod(
    @Param('periodId') periodId: string,
  ): Promise<ClassResponseDto[]> {
    return this.classesService.getClassesByPeriod(periodId);
  }

  @Post(':id/token')
  @Roles('admin')
  @ApiOperation({
    summary: 'Generate a class token',
    description:
      'Generate a new class token for the specified class ID with an expiration date.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the class',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: Object,
    description: 'Class token generation data',
    schema: {
      type: 'object',
      properties: {
        expirationDate: {
          type: 'string',
          format: 'date-time',
          description: 'Expiration date for the class token',
          example: '2023-12-31T23:59:59.000Z',
        },
      },
      required: ['expirationDate'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully generated the class token.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async generateClassToken(
    @Param('id') id: string,
    @Body() body: { expirationDate: Date },
  ): Promise<ClassToken> {
    return this.classTokenService.generateClassToken(
      id,
      new Date(body.expirationDate),
    );
  }
  @Get('tokens')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Get all active class tokens with pagination',
    description: 'Fetch all active class tokens with pagination support.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    description: 'Field to order by',
    type: String,
    example: 'created_at',
  })
  @ApiQuery({
    name: 'order_direction',
    required: false,
    description: 'Direction of the ordering',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched active class tokens.',
    type: ClassToken,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getActiveClassTokens(
    @Query() query: PaginationQueryDto,
  ): Promise<{ data: ClassToken[]; total: number }> {
    return this.classTokenService.getActiveClassTokensPaginated(query);
  }

  @Get(':classId/tokens')
  @Roles('admin', 'coordinator')
  @ApiOperation({
    summary: 'Get active class tokens by class ID with pagination',
    description:
      'Fetch all active class tokens for a specific class with pagination support.',
  })
  @ApiParam({
    name: 'classId',
    description: 'ID of the class',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    description: 'Field to order by',
    type: String,
    example: 'created_at',
  })
  @ApiQuery({
    name: 'order_direction',
    required: false,
    description: 'Direction of the ordering',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched active class tokens for the class.',
    type: ClassToken,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getActiveClassTokensByClass(
    @Param('classId') classId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<{ data: ClassToken[]; total: number }> {
    return this.classTokenService.getActiveClassTokensByClassPaginated(
      classId,
      query,
    );
  }
}
