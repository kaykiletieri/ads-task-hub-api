import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClassResponseDto {
  @IsString()
  @ApiProperty({
    description: 'ID of the class',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the class (periodLevel:class)',
    example: 'E2T1',
    required: true,
    type: 'string',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Axis of the class',
    example: '1',
    required: true,
    type: 'string',
  })
  axis: '1' | '2' | '3' | '4' | '5';

  @IsString()
  @ApiProperty({
    description: 'Period of the class',
    example: '2025/1',
    required: true,
    type: 'string',
  })
  period: string;

  @IsString()
  @ApiProperty({
    description: 'Creation date of the class',
    example: '2023-10-01T12:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsString()
  @ApiProperty({
    description: 'Last update date of the class',
    example: '2023-10-01T12:00:00Z',
    required: true,
    type: 'string',
  })
  updated_at: string;
}
