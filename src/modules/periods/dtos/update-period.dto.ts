import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePeriodDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the period',
    example: '2023-2024',
    required: false,
    type: 'string',
  })
  name?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Level of the period',
    example: 1,
    required: false,
    type: 'number',
  })
  level?: number;
}
