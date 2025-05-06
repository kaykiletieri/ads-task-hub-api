import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const PUBLIC_KEY = 'isPublic';

export const Public = () =>
  applyDecorators(
    SetMetadata(PUBLIC_KEY, true),
    ApiOperation({ security: [] }),
  );
