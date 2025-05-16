import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Title of the task',
    example: 'Complete the project report',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the task',
    example:
      'The project report should include all the findings and conclusions.',
  })
  description?: string;

  @ApiProperty({
    type: String,
    description: 'Link to the task or related resource',
    example: 'https://example.com/task/123',
  })
  link?: string;

  @ApiProperty({
    type: String,
    description: 'Type of the task',
    enum: ['project', 'task', 'assessment', 'meeting'],
    example: 'project',
  })
  type: string;

  @ApiProperty({
    type: String,
    description: 'Availability status of the task',
    enum: ['pending', 'expired', 'canceled', 'available'],
    example: 'available',
  })
  availability_status: string;

  @ApiProperty({
    type: String,
    description: 'Date and time when the task becomes available',
    example: '2023-10-01T00:00:00Z',
  })
  availability_at?: string;

  @ApiProperty({
    type: String,
    description: 'Deadline for the task',
    example: '2023-10-15',
  })
  deadline: string;

  @ApiProperty({
    type: String,
    description: 'ID of the user who created the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_at: Date;

  @ApiProperty({
    type: String,
    description: 'ID of the user who last updated the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updated_at: Date;

  @ApiProperty({
    type: String,
    description: 'ID of the user who created the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_by: string;

  @ApiProperty({
    type: String,
    description: 'ID of the user who last updated the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updated_by: string;
}
