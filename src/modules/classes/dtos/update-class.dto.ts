import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the class (periodLevel:class)',
    example: 'E2T1',
    required: false,
    type: 'string',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Axis of the class (1 to 5)',
    example: '2',
    required: false,
    type: 'string',
  })
  axis?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Period of the class (e.g., 2025/1)',
    example: '2025/2',
    required: false,
    type: 'string',
  })
  period?: string;
}
