import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreatePeriodDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Year of the period',
    example: 2023,
    required: true,
    type: 'number',
  })
  year: number;

  @IsEnum(['1', '2'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Semester of the period',
    example: '1',
    required: true,
    enum: ['1', '2'],
    type: 'string',
  })
  semester: '1' | '2';

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of the period',
    example: 1,
    required: true,
    type: 'number',
  })
  period_number: number;
}
