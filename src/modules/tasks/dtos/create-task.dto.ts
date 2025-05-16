import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  IsOptional,
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
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of the task',
    example: 'assessment',
    required: true,
    enum: ['project', 'task', 'assessment', 'meetting'],
    type: 'string',
  })
  type: 'project' | 'task' | 'assessment' | 'meetting';

  @IsEnum(['pending', 'expired', 'canceled', 'available'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Availability status of the task',
    example: 'pending',
    required: true,
    enum: ['pending', 'expired', 'canceled', 'available'],
    type: 'string',
  })
  availability_status: 'pending' | 'expired' | 'canceled' | 'available';

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
  @IsNotEmpty()
  @ApiProperty({
    description: 'Deadline for the task',
    example: '2025-07-10T00:00:00Z',
    required: true,
    type: 'string',
  })
  deadline: string;
}
