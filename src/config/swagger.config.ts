import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ADS Task Hub API')
    .setVersion('1.0')
    .setDescription('Documentação da API do projeto ADS Task Hub')
    .addServer(
      process.env.NODE_ENV === 'production'
        ? 'https://api.adstaskhub.com.br'
        : `http://localhost:${process.env.PORT ?? 3000}`,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Digite: Bearer <token>',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearerAuth: [] }];

  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  });
}
