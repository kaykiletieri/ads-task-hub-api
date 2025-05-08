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

  @IsEnum(['project', 'task', 'assessment', 'metting'])
  @IsOptional()
  @ApiProperty({
    description: 'Type of the task',
    example: 'assignment',
    required: false,
    enum: ['project', 'task', 'assessment', 'metting'],
    type: 'string',
  })
  type?: 'project' | 'task' | 'assessment' | 'metting';

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2025-07-10T00:00:00Z',
    required: false,
    type: 'string',
  })
  deadline?: string;

  @IsEnum(['pending', 'canceled', 'completed'])
  @IsOptional()
  @ApiProperty({
    description: 'Type of the task',
    example: 'pending',
    required: false,
    enum: ['pending', 'canceled', 'completed'],
    type: 'string',
  })
  status?: 'pending' | 'canceled' | 'completed';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Link to the task',
    example: 'https://example.com/task/123',
    required: false,
    type: 'string',
  })
  link?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the user associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  user_id?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the class associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  class_id?: string;
}
