import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthModule } from '../auth/auth.module';
import { Class } from '../classes/entities/classes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
