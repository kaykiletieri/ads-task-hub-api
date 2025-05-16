import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClassesService } from '../services/classes.service';
import { ClassTokenService } from '../services/class-token.service';
import { ClassResponseDto } from '../dtos/class-response.dto';
import { CreateClassDto } from '../dtos/create-class.dto';
import { UpdateClassDto } from '../dtos/update-class.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ClassToken } from '../entities/class-token.entity';
import { Roles } from '../../auth/decorators/role.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

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
    description: 'Retrieves all classes with optional pagination and sorting.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'order_by', required: false, type: String })
  @ApiQuery({ name: 'order_direction', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, type: ClassResponseDto, isArray: true })
  async getAllClasses(
    @Query() query: PaginationQueryDto,
  ): Promise<{ data: ClassResponseDto[]; total: number }> {
    return this.classesService.getAllClasses(query);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new class',
    description: 'Creates a new class with the provided details.',
  })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: 201, type: ClassResponseDto })
  async createClass(
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.createClass(createClassDto);
  }

  @Get('period/:periodId')
  @ApiOperation({
    summary: 'Get classes by period',
    description: 'Retrieves all classes for a specific period.',
  })
  @ApiParam({ name: 'periodId', type: String })
  @ApiResponse({ status: 200, type: ClassResponseDto, isArray: true })
  async getClassesByPeriod(
    @Param('periodId', new ParseUUIDPipe()) periodId: string,
  ): Promise<ClassResponseDto[]> {
    return this.classesService.getClassesByPeriod(periodId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get class by ID',
    description: 'Retrieves a class by its unique identifier.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ClassResponseDto })
  async getClassById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ClassResponseDto> {
    return this.classesService.getClassById(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update an existing class',
    description: 'Updates an existing class with the provided details.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, type: ClassResponseDto })
  async updateClass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete a class',
    description: 'Deletes a class by its unique identifier.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  async deleteClass(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.classesService.deleteClass(id);
  }
}
