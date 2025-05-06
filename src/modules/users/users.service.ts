import { Injectable, Logger } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  // Example method to verify a user's password
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Placeholder implementation
    return password === hashedPassword;
  }
}
