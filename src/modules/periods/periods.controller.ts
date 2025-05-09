import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodResponseDto } from './dtos/period-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreatePeriodDto } from './dtos/create-period.dto';
import { UpdatePeriodDto } from './dtos/update-period.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('periods')
@ApiTags('Periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all periods with pagination',
    description: 'Fetch all periods with pagination support.',
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
    description: 'Successfully fetched periods.',
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAllPeriods(
    @Query() query: PaginationQueryDto,
  ): Promise<{ data: PeriodResponseDto[]; total: number }> {
    return this.periodsService.getAllPeriods(query);
  }

  @Get('year/:year')
  @ApiOperation({
    summary: 'Get periods by year',
    description: 'Fetch all periods for a specific year.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched periods for the given year.',
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'No periods found for the given year.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getPeriodsByYear(
    @Param('year') year: number,
  ): Promise<PeriodResponseDto[]> {
    return this.periodsService.getPeriodsByYear(year);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get period by ID',
    description: 'Fetch a specific period by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the period.',
    type: PeriodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Period not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getPeriodById(@Param('id') id: string): Promise<PeriodResponseDto> {
    return this.periodsService.getPeriodById(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new period',
    description: 'Create a new period with the provided data.',
  })
  @ApiBody({
    type: CreatePeriodDto,
    description: 'Period data to create a new period.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the period.',
    type: PeriodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async createPeriod(
    @Body() createPeriodDto: CreatePeriodDto,
  ): Promise<PeriodResponseDto> {
    return this.periodsService.createPeriod(createPeriodDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing period',
    description: 'Update the period details by ID.',
  })
  @Roles('admin')
  @ApiBody({
    type: UpdatePeriodDto,
    description: 'Period data to update the existing period.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the period.',
    type: PeriodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Period not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async updatePeriod(
    @Param('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ): Promise<PeriodResponseDto> {
    return this.periodsService.updatePeriod(id, updatePeriodDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a period',
    description: 'Delete a specific period by ID.',
  })
  @Roles('admin')
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the period.',
  })
  @ApiResponse({
    status: 404,
    description: 'Period not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async deletePeriod(@Param('id') id: string): Promise<void> {
    return this.periodsService.deletePeriod(id);
  }
}
