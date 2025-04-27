import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsUUID } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the user',
    example: 'Kayki Letieri',
    required: true,
    type: 'string',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    required: true,
    type: 'string',
  })
  email: string;

  @IsUUID()
  @ApiProperty({
    description: 'Class ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  classId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Period ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  periodId: string;
}
