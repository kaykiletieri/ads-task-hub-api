import {
  INestApplication,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import * as compression from 'compression';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';

export function setupGlobalConfigurations(app: INestApplication): void {
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
  });

  app.use(helmet());

  app.use(compression());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
