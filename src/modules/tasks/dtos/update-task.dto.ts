import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Title of the task',
    example: 'Math Assignment 1',
    required: false,
    type: 'string',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the task',
    example: 'Complete the first chapter exercises',
    required: false,
    type: 'string',
  })
  description?: string;

  @IsEnum(['project', 'assignment', 'documentation', 'report'])
  @IsOptional()
  @ApiProperty({
    description: 'Type of the task',
    example: 'assignment',
    required: false,
    enum: ['project', 'assignment', 'documentation', 'report'],
    type: 'string',
  })
  type?: 'project' | 'assignment' | 'documentation' | 'report';

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2023-10-01T00:00:00Z',
    required: false,
    type: 'string',
  })
  deadline?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the class associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  classId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the period associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  periodId?: string;
}
