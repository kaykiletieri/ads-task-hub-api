import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true }),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<{ userId: string; username: string }> {
    this.logger.debug('Validating JWT payload...');

    const { sub, username } = payload;

    if (!sub || !username) {
      this.logger.warn('Invalid JWT payload');
      throw new Error('Invalid JWT payload');
    }

    this.logger.debug(`JWT validated successfully for user: ${username}`);

    return {
      userId: sub,
      username: username,
    };
  }
}
