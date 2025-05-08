import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from '../periods/periods.entity';
import { Class } from './classes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Period]),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
