import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/classes.entity';
import { CreateClassDto } from '../dtos/create-class.dto';
import { UpdateClassDto } from '../dtos/update-class.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ClassResponseDto } from '../dtos/class-response.dto';
import { Period } from '../../periods/periods.entity';
import { ClassToken } from '../entities/class-token.entity';
import { ClassTokenService } from './class-token.service';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    @InjectRepository(Class) private readonly classRepository: Repository<Class>,
    @InjectRepository(Period) private readonly  periodRepository: Repository<Period>,
    private readonly classTokenService: ClassTokenService,
  ) {}

  async getAllClasses(
    queryDto: PaginationQueryDto,
  ): Promise<{ data: ClassResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;
    this.logger.debug(
      `Fetching classes - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const [data, total] = await this.classRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { [order_by]: order_direction },
    });

    this.logger.debug(`Found ${total} classes`);

    return {
      data: data.map((classEntity) => this.mapToResponseDto(classEntity)),
      total,
    };
  }

  async getClassById(id: string): Promise<ClassResponseDto> {
    this.logger.debug(`Fetching class with ID: ${id}`);

    const classEntity = await this.classRepository.findOne({
      where: { id },
    });

    if (!classEntity) {
      this.logger.warn(`Class with ID: ${id} not found`);
      throw new BadRequestException('Class not found');
    }

    this.logger.debug(`Found class with ID: ${id}`);

    return this.mapToResponseDto(classEntity);
  }

  async createClass(dto: CreateClassDto): Promise<ClassResponseDto> {
    this.logger.debug(
      `Creating class with number: ${dto.class_number}, period_id: ${dto.period_id}`,
    );

    const period = await this.periodRepository.findOne({
      where: { id: dto.period_id },
    });

    if (!period) {
      this.logger.warn(`Period with ID: ${dto.period_id} not found`);
      throw new BadRequestException('Period not found');
    }

    const classEntity: Class = this.classRepository.create({
      class_number: dto.class_number,
      teacher_name: dto.teacher_name,
      period: { id: dto.period_id },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await this.classRepository.save(classEntity);
    this.logger.debug(`Class created with ID: ${classEntity.id}`);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15);
    this.classTokenService.generateClassToken(classEntity.id, expirationDate)

    return this.mapToResponseDto(classEntity);
  }

  async updateClass(
    id: string,
    dto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    this.logger.debug(`Updating class with ID: ${id}`);

    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['period'],
    });

    if (!classEntity) {
      this.logger.warn(`Class with ID: ${id} not found`);
      throw new BadRequestException('Class not found');
    }

    if (dto.period_id) {
      const period = await this.periodRepository.findOne({
        where: { id: dto.period_id },
      });
      if (!period) {
        this.logger.warn(`Period with ID: ${dto.period_id} not found`);
        throw new BadRequestException('Period not found');
      }
      classEntity.period = period;
    }
    classEntity.class_number = dto.class_number || classEntity.class_number;
    classEntity.teacher_name = dto.teacher_name || classEntity.teacher_name;
    classEntity.updated_at = new Date().toISOString();

    await this.classRepository.save(classEntity);

    this.logger.debug(`Class updated with ID: ${classEntity.id}`);

    return this.mapToResponseDto(classEntity);
  }

  async deleteClass(id: string): Promise<void> {
    this.logger.debug(`Deleting class with ID: ${id}`);

    const classEntity = await this.classRepository.findOne({ where: { id } });

    if (!classEntity) {
      this.logger.warn(`Class with ID: ${id} not found`);
      throw new BadRequestException('Class not found');
    }

    await this.classRepository.remove(classEntity);

    this.logger.debug(`Class with ID: ${id} deleted`);
  }

  async getClassesByPeriod(periodId: string): Promise<ClassResponseDto[]> {
    this.logger.debug(`Fetching classes for period with ID: ${periodId}`);

    const classes = await this.classRepository.find({
      where: { period: { id: periodId } },
      relations: ['period'],
    });

    if (classes.length === 0) {
      this.logger.warn(`No classes found for period with ID: ${periodId}`);
      throw new BadRequestException('No classes found for this period');
    }

    this.logger.debug(
      `Found ${classes.length} classes for period with ID: ${periodId}`,
    );

    return classes.map((classEntity) => this.mapToResponseDto(classEntity));
  }

  private mapToResponseDto(classEntity: Class): ClassResponseDto {
    return {
      id: classEntity.id,
      class_number: classEntity.class_number,
      teacher_name: classEntity.teacher_name,
      period_id: classEntity.period.id,
      created_at: classEntity.created_at,
      updated_at: classEntity.updated_at,
    };
  }
}
