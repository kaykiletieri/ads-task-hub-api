import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';

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
    example: 'letieri.dev@gmail.com',
    required: true,
    type: 'string',
  })
  email: string;

  @IsEnum(['student', 'coordinator', 'admin'])
  @ApiProperty({
    description: 'Role of the user',
    example: 'student',
    required: true,
    enum: ['student', 'coordinator', 'admin'],
    type: 'string',
  })
  role: 'student' | 'coordinator' | 'admin';

  @IsDateString()
  @ApiProperty({
    description: 'Creation date of the user',
    example: '2003-07-10T12:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsDateString()
  @ApiProperty({
    description: 'Last update date of the user',
    example: '2025-00-01T00:00:00Z',
    required: true,
    type: 'string',
  })
  updated_at: string;

  @IsUUID()
  @ApiProperty({
    description: 'Class ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  classId: string;
}
