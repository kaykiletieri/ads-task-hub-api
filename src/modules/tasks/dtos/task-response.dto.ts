import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsUUID } from 'class-validator';

export class TaskResponseDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Title of the task',
    example: 'Math Assignment 1',
    required: true,
    type: 'string',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the task',
    example: 'Complete the first chapter exercises',
    required: false,
    type: 'string',
  })
  description?: string;

  @IsEnum(['project', 'task', 'assessment', 'metting'])
  @ApiProperty({
    description: 'Type of the task',
    example: 'assignment',
    required: true,
    enum: ['project', 'task', 'assessment', 'metting'],
    type: 'string',
  })
  type: 'project' | 'task' | 'assessment' | 'metting';

  @IsDateString()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2025-07-10T00:00:00Z',
    required: true,
    type: 'string',
  })
  deadline: string;

  @IsEnum(['pending', 'canceled', 'completed'])
  @ApiProperty({
    description: 'Type of the task',
    example: 'pending',
    required: true,
    enum: ['pending', 'canceled', 'completed'],
    type: 'string',
  })
  status: 'pending' | 'canceled' | 'completed';

  @IsDateString()
  @ApiProperty({
    description: 'Creation date of the task',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsDateString()
  @ApiProperty({
    description: 'Last update date of the task',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  updated_at: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the user associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  user_id: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the class associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  class_id: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the period associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  period_id: string;
}
