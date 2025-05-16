import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as generateUUID } from 'uuid';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PasswordHasherService } from '../auth/services/password-hasher.service';
import { Class } from '../classes/entities/classes.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.debug(
      `Creating user with data: ${JSON.stringify(userDto, null, 2)}`,
    );

    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser) {
      this.logger.warn(`User with email ${userDto.email} already exists`);
      throw new BadRequestException('User already exists');
    }

    const user: User = this.userRepository.create({
      id: generateUUID(),
      name: userDto.name,
      email: userDto.email,
      password_hash: await this.passwordHasherService.hashPassword(
        userDto.password,
      ),
      role: userDto.role,
      class: { id: userDto.class_id },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await this.userRepository.save(user);
    this.logger.debug(`User created with ID: ${user.id}`);

    return this.mapToResponseDto(user);
  }

  async getAllUsers(
    queryDto: PaginationQueryDto,
    classId?: string,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      order_by = 'created_at',
      order_direction = 'DESC',
    } = queryDto;

    this.logger.debug(
      `Fetching users - page: ${page}, limit: ${limit}, order by: ${order_by}, direction: ${order_direction}`,
    );

    const whereCondition = classId ? { class: { id: classId } } : {};

    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: (page - 1) * limit,
      order: { [order_by]: order_direction },
      relations: ['class'],
    });

    this.logger.debug(`Found ${total} users`);

    return {
      data: data.map((userEntity) => this.mapToResponseDto(userEntity)),
      total,
    };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    this.logger.debug(`Fetching user with ID: ${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!user) {
      this.logger.warn(`User with ID: ${id} not found`);
      throw new BadRequestException('User not found');
    }

    this.logger.debug(`Found user with ID: ${id}`);

    return this.mapToResponseDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.debug(`Updating user with ID: ${id}`);

    const userEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!userEntity) {
      this.logger.warn(`User with ID: ${id} not found`);
      throw new BadRequestException('User not found');
    }

    if (dto.class_id) {
      const classEntity = await this.classRepository.findOne({
        where: { id: dto.class_id },
      });
      if (!classEntity) {
        this.logger.warn(`Class with ID: ${dto.class_id} not found`);
        throw new BadRequestException('Class not found');
      }
      userEntity.class = classEntity;
    }

    userEntity.name = dto.name || userEntity.name;
    userEntity.email = dto.email || userEntity.email;
    userEntity.password_hash = dto.password || userEntity.password_hash;
    userEntity.role = dto.role || userEntity.role;
    userEntity.updated_at = new Date();

    await this.userRepository.save(userEntity);

    this.logger.debug(`User updated with ID: ${userEntity.id}`);

    return this.mapToResponseDto(userEntity);
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.debug(`Deleting user with ID: ${id}`);

    const userEntity = await this.userRepository.findOne({ where: { id } });

    if (!userEntity) {
      this.logger.warn(`User with ID: ${id} not found`);
      throw new BadRequestException('User not found');
    }

    await this.userRepository.remove(userEntity);

    this.logger.debug(`User with ID: ${id} deleted`);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at.toDateString(),
      updated_at: user.updated_at.toDateString(),
      class_id: user.class?.id,
    };
  }

  private async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Finding user with email ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.debug(`User with email ${email} not found`);
      return null;
    }
    return user;
  }

  async updateFcmToken(
    userId: string,
    fcmToken: string,
  ): Promise<{ fcm_token: string }> {
    this.logger.debug(`Updating fmc token from user ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.error(`User not found (${userId})`);
      throw new Error('User not found');
    }

    if (user.fcm_token === fcmToken) {
      this.logger.warn(
        `The new fcm token is the same as the current one ${fcmToken}`,
      );
      throw new BadRequestException(
        `The new fcm token is the same as the current one`,
      );
    }

    user.fcm_token = fcmToken;
    user.updated_at = new Date();

    await this.userRepository.save(user);
    this.logger.warn(`Updated fcm token for user ${userId}`);

    return { fcm_token: user.fcm_token };
  }
}
