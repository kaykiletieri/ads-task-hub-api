import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload): {
    userId: string;
    username: string;
    role: string;
  } {
    this.logger.debug('Validating JWT payload...');

    const { sub, username, role } = payload;

    if (!sub || !username || !role) {
      this.logger.warn('Invalid JWT payload');
      throw new Error('Invalid JWT payload');
    }

    this.logger.debug(`JWT validated successfully for user: ${username}`);

    return {
      userId: sub,
      username: username,
      role: role,
    };
  }
}
