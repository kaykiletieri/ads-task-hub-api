import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/users.entity';
import { PasswordHasherService } from './password-hasher.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { ClassTokenService } from '../../classes/services/class-token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly classTokenService: ClassTokenService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.debug(`Validating user with email: ${email}`);
    const user: User | null = await this.findByEmail(email);

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    this.logger.debug(`User found: ${JSON.stringify(user, null, 2)}`);
    const isPasswordValid = await this.passwordHasherService.verifyPassword(
      password,
      user.password_hash,
    );
    this.logger.debug(`Password comparison result: ${isPasswordValid}`);

    if (isPasswordValid) {
      this.logger.debug(
        `User validated successfully, returning user data without passwordHash`,
      );
      return user;
    }

    this.logger.warn(`Invalid password for user with email: ${email}`);
    return null;
  }

  async login(user: AuthDto): Promise<LoginResponseDto> {
    this.logger.debug(`Logging in user: ${JSON.stringify(user, null, 2)}`);
    const userEntity = await this.findByEmail(user.email);
    if (!userEntity) {
      this.logger.warn(`User with email ${user.email} not found`);
      throw new BadRequestException('User not found');
    }
    const payload: JwtPayload = { username: userEntity.name, sub: userEntity.id, role: userEntity.role };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token: ${token}`);
    return {
      access_token: token,
    };
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    this.logger.debug(`Registering user: ${JSON.stringify(dto, null, 2)}`);

    const classEntity = await this.classTokenService.validateClassToken(dto.class_token);

    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      this.logger.warn(`User with email ${dto.email} already exists`);
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.passwordHasherService.hashPassword(dto.password);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password_hash: hashedPassword,
      role: 'student',
      class: classEntity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await this.userRepository.save(user);

    this.logger.debug(`User registered successfully: ${JSON.stringify(user, null, 2)}`);

    const payload: JwtPayload = { username: user.name, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token: ${token}`);
    return {
      access_token: token,
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
}
