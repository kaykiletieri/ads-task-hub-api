import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the class (periodLevel:class)',
    example: 'E2T1',
    required: true,
    type: 'string',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Axis of the class (1 to 5)',
    example: '1',
    required: true,
    type: 'string',
  })
  axis: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Period of the class (e.g., 2025/1)',
    example: '2025/1',
    required: true,
    type: 'string',
  })
  period: string;
}
