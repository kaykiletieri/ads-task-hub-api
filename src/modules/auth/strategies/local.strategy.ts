import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user with email: ${email}`);

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.warn(`Invalid credentials for email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.debug(`User validated successfully: ${email}`);
    return user;
  }
}
