import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class PeriodResponseDto {
  @IsString()
  @ApiProperty({
    description: 'Unique identifier for the period',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Year of the period',
    example: 2023,
    required: true,
    type: 'number',
  })
  year: number;

  @IsEnum(['1', '2'])
  @ApiProperty({
    description: 'Semester of the period',
    examples: ['1', '2'],
    required: true,
    enum: ['1', '2'],
    type: 'string',
  })
  semester: '1' | '2';

  @IsNumber()
  @ApiProperty({
    description: 'Number of the period',
    example: 1,
    required: true,
    type: 'number',
  })
  period_number: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the period active?',
    example: true,
    required: true,
  })
  is_active: boolean;

  @IsDateString()
  @ApiProperty({
    description: 'Creation date of the period',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsDateString()
  @ApiProperty({
    description: 'Last update date of the period',
    example: '2025-01-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  updated_at: string;
}
