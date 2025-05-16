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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Link to the task',
    example: 'https://example.com/task/123',
    required: false,
    type: 'string',
  })
  link?: string;

  @IsEnum(['project', 'task', 'assessment', 'meetting'])
  @IsOptional()
  @ApiProperty({
    description: 'Type of the task',
    example: 'assignment',
    required: false,
    enum: ['project', 'task', 'assessment', 'meetting'],
    type: 'string',
  })
  type?: 'project' | 'task' | 'assessment' | 'meetting';

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Availability date for the task',
    example: '2025-07-10T00:00:00Z',
    required: false,
    type: 'string',
  })
  availability_status?: 'pending' | 'expired' | 'canceled' | 'available';

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Availability date for the task',
    example: '2025-07-10T00:00:00Z',
    required: false,
    type: 'string',
  })
  availability_at?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2025-07-10T00:00:00Z',
    required: false,
    type: 'string',
  })
  deadline?: string;
}
