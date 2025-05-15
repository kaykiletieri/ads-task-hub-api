import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export class UpdatePeriodDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Year of the period',
    example: 2023,
    required: false,
    type: 'number',
  })
  year?: number;

  @IsEnum(['1', '2'])
  @IsOptional()
  @ApiProperty({
    description: 'Semester of the period',
    example: '1',
    required: false,
    enum: ['1', '2'],
    type: 'string',
  })
  semester?: '1' | '2';

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Number of the period',
    example: 1,
    required: false,
    type: 'number',
  })
  period_number?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is the period active?',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
