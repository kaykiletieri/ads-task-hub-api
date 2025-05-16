import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { setupGlobalConfigurations } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupGlobalConfigurations(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
} bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
