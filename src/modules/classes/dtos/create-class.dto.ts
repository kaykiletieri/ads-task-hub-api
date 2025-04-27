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
}
