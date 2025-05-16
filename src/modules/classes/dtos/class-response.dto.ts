import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class ClassResponseDto {
  @IsString()
  @ApiProperty({
    description: 'ID of the class',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Class number',
    example: 1,
    required: true,
    type: 'number',
  })
  class_number: number;

  @IsString()
  @ApiProperty({
    description: 'Teacher name',
    example: 'Kayki Letieri',
    required: false,
    type: 'string',
  })
  teacher_name?: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the period',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  period_id: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the class active?',
    example: true,
    required: true,
  })
  is_active: boolean;

  @IsDateString()
  @ApiProperty({
    description: 'Creation date of the class',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsDateString()
  @ApiProperty({
    description: 'Last update date of the class',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  updated_at: string;
}
