import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as generateUUID } from 'uuid';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PasswordHasherService } from '../auth/password-hasher.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHasherService: PasswordHasherService,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Finding user with email ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.debug(`User with email ${email} not found`);
      return null;
    }
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.debug(`Creating user with data: ${JSON.stringify(userDto, null, 2)}`);

    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser) {
      this.logger.warn(`User with email ${userDto.email} already exists`);
      throw new BadRequestException('User already exists');
    }

    const user: User = this.userRepository.create(
      {
        id: generateUUID(),
        name: userDto.name,
        email: userDto.email,
        password_hash: await this.passwordHasherService.hashPassword(userDto.password),
        role: userDto.role,
        class: { id: userDto.classId },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },

    );
    await this.userRepository.save(user);
    this.logger.debug(`User created with ID: ${user.id}`);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      classId: user.class?.id,
    };
  }
}
