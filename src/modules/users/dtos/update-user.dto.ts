import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

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
    example: 'user@example.com',
    required: false,
    type: 'string',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: false,
    type: 'string',
  })
  password?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Class ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  classId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Period ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  periodId?: string;
}
