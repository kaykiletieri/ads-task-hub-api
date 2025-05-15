import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Period } from './periods.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodResponseDto } from './dtos/period-response.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreatePeriodDto } from './dtos/create-period.dto';
import { UpdatePeriodDto } from './dtos/update-period.dto';

@Injectable()
export class PeriodsService {
  private readonly logger = new Logger(PeriodsService.name);

  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  async getAllPeriods(
    queryDto: PaginationQueryDto,
  ): Promise<{ data: PeriodResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;
    this.logger.debug(
      `Fetching periods - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const [data, total] = await this.periodRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      where: { is_active: true },
      order: { [order_by]: order_direction },
    });

    this.logger.debug(`Found ${total} periods`);

    return {
      data: data.map((period) => this.mapToResponseDto(period)),
      total,
    };
  }

  async getPeriodsByYear(year: number): Promise<PeriodResponseDto[]> {
    this.logger.debug(`Fetching periods for year: ${year}`);

    const periods = await this.periodRepository.find({
      where: { year, is_active: true },
      order: { semester: 'ASC', period_number: 'ASC' },
    });

    this.logger.debug(`Found ${periods.length} periods for year: ${year}`);

    return periods.map((period) => this.mapToResponseDto(period));
  }

  async getPeriodById(id: string): Promise<PeriodResponseDto> {
    this.logger.debug(`Fetching period with ID: ${id}`);

    const period = await this.periodRepository.findOne({
      where: { id, is_active: true },
    });

    if (!period) {
      this.logger.warn(`Period with ID: ${id} not found`);
      throw new BadRequestException('Period not found');
    }

    this.logger.debug(`Found period with ID: ${id}`);

    return this.mapToResponseDto(period);
  }

  async createPeriod(dto: CreatePeriodDto): Promise<PeriodResponseDto> {
    this.logger.debug(
      `Creating period for year: ${dto.year}, semester: ${dto.semester}, period number: ${dto.period_number}`,
    );

    const existingPeriod = await this.periodRepository.findOne({
      where: {
        year: dto.year,
        semester: dto.semester,
        period_number: dto.period_number,
      },
    });

    if (existingPeriod) {
      this.logger.warn(
        `Period already exists for year: ${dto.year}, semester: ${dto.semester}, period number: ${dto.period_number}`,
      );
      throw new BadRequestException('Period already exists');
    }

    const period: Period = this.periodRepository.create({
      year: dto.year,
      semester: dto.semester,
      period_number: dto.period_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    });

    await this.periodRepository.save(period);

    this.logger.debug(`Period created with ID: ${period.id}`);

    return this.mapToResponseDto(period);
  }

  async updatePeriod(
    id: string,
    dto: UpdatePeriodDto,
  ): Promise<PeriodResponseDto> {
    this.logger.debug(`Updating period with ID: ${id}`);

    const period: Period | null = await this.periodRepository.findOne({
      where: { id },
    });

    if (!period) {
      this.logger.warn(`Period with ID: ${id} not found`);
      throw new BadRequestException('Period not found');
    }

    period.year = dto.year || period.year;
    period.semester = dto.semester || period.semester;
    period.period_number = dto.period_number || period.period_number;
    period.updated_at = new Date().toISOString();
    period.is_active = dto.is_active !== undefined ? dto.is_active : period.is_active;

    await this.periodRepository.save(period);

    this.logger.debug(`Period updated with ID: ${period.id}`);

    return this.mapToResponseDto(period);
  }

  async deletePeriod(id: string): Promise<void> {
    this.logger.debug(`Deleting period with ID: ${id}`);

    const period = await this.periodRepository.findOne({ where: { id } });

    if (!period) {
      this.logger.warn(`Period with ID: ${id} not found`);
      throw new BadRequestException('Period not found');
    }

    await this.periodRepository.remove(period);

    this.logger.debug(`Period with ID: ${id} deleted`);
  }

  private mapToResponseDto(period: Period): PeriodResponseDto {
    return {
      id: period.id,
      year: period.year,
      semester: period.semester,
      period_number: period.period_number,
      created_at: period.created_at,
      updated_at: period.updated_at,
    };
  }
}
