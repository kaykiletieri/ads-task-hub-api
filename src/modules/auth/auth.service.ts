import { Injectable, Logger } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user with email: ${email}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    this.logger.debug(`User found: ${JSON.stringify(user, null, 2)}`);
    const isPasswordValid = await this.usersService.verifyPassword(
      password,
      user.password,
    );
    this.logger.debug(`Password comparison result: ${isPasswordValid}`);

    if (isPasswordValid) {
      const { password, ...result } = user;
      this.logger.debug(
        `User validated successfully, returning user data without passwordHash `,
        password,
      );
      return result;
    }

    this.logger.warn(`Invalid password for user with email: ${email}`);
    return null;
  }

  async login(user: AuthDto) {
    this.logger.debug(`Logging in user: ${JSON.stringify(user, null, 2)}`);
    const userEntity = await this.usersService.findByEmail(user.email);
    if (!userEntity) {
      this.logger.warn(`User with email ${user.email} not found`);
      throw new Error('User not found');
    }
    const payload = { username: userEntity.name, sub: userEntity.id };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token: ${token}`);
    return {
      access_token: token,
    };
  }
}
