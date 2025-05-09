import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClassToken } from '../entities/class-token.entity';
import { Class } from '../entities/classes.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class ClassTokenService {
  private readonly logger = new Logger(ClassTokenService.name);

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(ClassToken)
    private readonly classTokenRepository: Repository<ClassToken>,
  ) {}

  async generateClassToken(
    classId: string,
    expirationDate: Date,
  ): Promise<ClassToken> {
    this.logger.debug(`Generating class token for class ID: ${classId}`);

    const currentDate = new Date();

    if (expirationDate <= new Date()) {
      this.logger.warn(`Expiration date must be in the future`);
      throw new BadRequestException('Expiration date must be in the future');
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['period'],
    });
    if (!classEntity) {
      this.logger.warn(`Class with ID ${classId} not found`);
      throw new BadRequestException('Class not found');
    }

    const lastToken = await this.getLastClassToken(classId);
    if (lastToken) {
      this.logger.debug(`Last token found: ${lastToken.token}`);

      if (new Date(lastToken.expiration_date) >= currentDate) {
        this.logger.warn(`Class token is still active`);
        throw new BadRequestException('Class token is still active');
      }
    }

    const prefix = this.generatePrefix(
      classEntity.class_number,
      classEntity.period.period_number,
      classEntity.period.year,
    );
    const randomString = this.generateRandomString(3);
    const lastTokenNumber = (lastToken?.token_number ?? 0) + 1;
    const token = `${prefix}-${randomString + lastTokenNumber}`;

    const newClassToken: ClassToken = this.classTokenRepository.create({
      token: token,
      expiration_date: expirationDate.toISOString(),
      token_number: lastToken ? lastToken.token_number + 1 : 1,
      created_at: currentDate.toISOString(),
      class: classEntity,
    });

    return this.classTokenRepository.save(newClassToken);
  }

  async validateClassToken(token: string): Promise<Class> {
    this.logger.debug(`Validating class token: ${token}`);

    const classToken = await this.classTokenRepository.findOne({
      where: { token },
      relations: ['class'],
    });

    if (!classToken) {
      this.logger.warn(`Class token not found`);
      throw new BadRequestException('Invalid class token');
    }

    const currentDate = new Date();
    if (new Date(classToken.expiration_date) < currentDate) {
      this.logger.warn(`Class token has expired`);
      throw new BadRequestException('Invalid class token');
    }

    return classToken.class;
  }

  private generatePrefix(
    classNumber: number,
    periodId: number,
    year: number,
  ): string {
    const classPrefix = `T${String(classNumber).padStart(2, '0')}`;
    const periodPrefix = `E${String(periodId).padStart(2, '0')}`;
    return `${classPrefix + periodPrefix}-${year}`;
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }

  async getActiveClassTokensPaginated(
    queryDto: PaginationQueryDto,
  ): Promise<{ data: ClassToken[]; total: number }> {
    this.logger.debug(
      `Fetching active class tokens with pagination: page ${queryDto.page}, limit ${queryDto.limit}`,
    );

    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;
    this.logger.debug(
      `Fetching classes - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const [data, total] = await this.classTokenRepository.findAndCount({
      where: {
        expiration_date: MoreThan(new Date().toISOString()),
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { [order_by]: order_direction },
    });

    return { data, total };
  }

  async getActiveClassTokensByClassPaginated(
    classId: string,
    queryDto: PaginationQueryDto,
  ): Promise<{ data: ClassToken[]; total: number }> {
    this.logger.debug(
      `Fetching active class tokens for class ID ${classId} with pagination: page ${queryDto.page}, limit ${queryDto.limit}`,
    );

    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;
    this.logger.debug(
      `Fetching classes - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const [data, total] = await this.classTokenRepository.findAndCount({
      where: {
        class: { id: classId },
        expiration_date: MoreThan(new Date().toISOString()),
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { [order_by]: order_direction },
    });

    return { data, total };
  }

  private getLastClassToken(classId: string): Promise<ClassToken | null> {
    this.logger.debug(`Fetching last class token for class ID: ${classId}`);
    return this.classTokenRepository.findOne({
      where: { class: { id: classId } },
      order: { created_at: 'DESC' },
    });
  }
}
