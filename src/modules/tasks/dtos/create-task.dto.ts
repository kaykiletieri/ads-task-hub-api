import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the task',
    example: 'Math Assignment 1',
    required: true,
    type: 'string',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description of the task',
    example: 'Complete the first chapter exercises',
    required: true,
    type: 'string',
  })
  description: string;

  @IsEnum(['project', 'assignment', 'documentation', 'report'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of the task',
    example: 'assignment',
    required: true,
    enum: ['project', 'assignment', 'documentation', 'report'],
    type: 'string',
  })
  type: 'project' | 'assignment' | 'documentation' | 'report';

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2023-10-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  deadline: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the class associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the period associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: true,
    type: 'string',
  })
  periodId: string;
}
