import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class PeriodResponseDto {
  @IsString()
  @ApiProperty({
    description: 'Unique identifier for the period',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the period',
    example: '2023-2024',
    required: true,
    type: 'string',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    description: 'Level of the period',
    example: 1,
    required: true,
    type: 'number',
  })
  level: number;
}
