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
}
