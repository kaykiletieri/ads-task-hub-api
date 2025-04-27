import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ClassesModule } from './modules/classes/classes.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { Class } from './modules/classes/classes.entity';
import { Period } from './modules/periods/periods.entity';
import { Task } from './modules/tasks/tasks.entity';
import { User } from './modules/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Task, Period, Class],
      synchronize: true,
    }),
    UsersModule,
    TasksModule,
    ClassesModule,
    PeriodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
