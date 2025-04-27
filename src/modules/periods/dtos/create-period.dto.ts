import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePeriodDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the period',
    example: '2023-2024',
    required: true,
    type: 'string',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Level of the period',
    example: 1,
    required: true,
    type: 'number',
  })
  level: number;
}
