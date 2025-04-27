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
}
