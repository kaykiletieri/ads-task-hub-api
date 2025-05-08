import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the user',
    example: 'Kayki Letieri',
    required: false,
    type: 'string',
  })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Email of the user',
    example: 'dev.letieri@gmail.com',
    required: false,
    type: 'string',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Password of the user',
    example: '123457',
    required: false,
    type: 'string',
  })
  password?: string;

  @IsOptional()
  @IsEnum(['student', 'coordinator', 'admin'])
  @ApiProperty({
    description: 'Role of the user',
    example: 'student',
    required: false,
    enum: ['student', 'coordinator', 'admin'],
    type: 'string',
  })
  role?: 'student' | 'coordinator' | 'admin';

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Class ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  classId?: string;
}
