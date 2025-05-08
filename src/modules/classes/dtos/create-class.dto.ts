import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the class (periodLevel:class)',
    example: 'E2T1',
    required: true,
    type: 'string',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class number',
    example: 1,
    required: true,
    type: 'number',
  })
  class_number: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Teacher name',
    example: 'Kayki Letieri',
    required: false,
    type: 'string',
  })
  teacher_name?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the period',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  period_id: string;
}
