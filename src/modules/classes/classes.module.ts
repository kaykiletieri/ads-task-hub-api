import { Module } from '@nestjs/common';
import { ClassesService } from './services/classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from '../periods/periods.entity';
import { Class } from './entities/classes.entity';
import { ClassToken } from './entities/class-token.entity';
import { ClassTokenService } from './services/class-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, ClassToken, Period]),
  ],
  providers: [ClassesService, ClassTokenService],
  controllers: [ClassesController],
  exports: [ClassesService, ClassTokenService],
})
export class ClassesModule {}
