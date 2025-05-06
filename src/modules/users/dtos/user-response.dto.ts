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

  @IsString()
  @ApiProperty({
    description: 'Role of the user',
    example: 'student',
    required: true,
    type: 'string',
  })
  role: 'student' | 'coordinator' | 'admin';

  @IsString()
  @ApiProperty({
    description: 'Creation date of the user',
    example: '2023-10-01T12:00:00Z',
    required: true,
    type: 'string',
  })
  created_at: string;

  @IsString()
  @ApiProperty({
    description: 'Last update date of the user',
    example: '2023-10-01T12:00:00Z',
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
